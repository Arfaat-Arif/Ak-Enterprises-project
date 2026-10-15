<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exceptions\ProductImageStorageException;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use Aws\Exception\AwsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProductController extends Controller
{
    private const SAFE_AWS_ERROR_CODES = [
        'AccessDenied',
        'AccessDeniedException',
        'AuthorizationHeaderMalformed',
        'BadRequest',
        'EntityTooLarge',
        'ExpiredToken',
        'InternalError',
        'InvalidAccessKeyId',
        'InvalidArgument',
        'InvalidRequest',
        'InvalidToken',
        'NoSuchBucket',
        'NoSuchKey',
        'PermanentRedirect',
        'RequestTimeTooSkewed',
        'RequestTimeout',
        'ServiceUnavailable',
        'SignatureDoesNotMatch',
        'SlowDown',
        'XAmzContentSHA256Mismatch',
    ];

    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with(['images', 'category'])
            ->when($request->query('category'), function ($q, $slug) {
                $q->whereHas('category', fn ($cq) => $cq->where('slug', $slug));
            })
            ->when($request->query('search'), function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('name', 'like', "%{$term}%")
                        ->orWhere('brand', 'like', "%{$term}%")
                        ->orWhere('sku', 'like', "%{$term}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(20);

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product->load('images', 'category'));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id'     => ['required', 'exists:categories,id'],
            'brand'           => ['required', 'string', 'max:120'],
            'name'            => ['required', 'string', 'max:160'],
            'sku'             => ['required', 'string', 'max:60', 'unique:products,sku'],
            'short_description' => ['required', 'string', 'max:255'],
            'description'     => ['required', 'string'],
            'price'           => ['nullable', 'numeric'],
            'is_featured'     => ['sometimes', 'boolean'],
            'is_active'       => ['sometimes', 'boolean'],
            'sort_order'      => ['sometimes', 'integer'],
            'images'          => ['nullable', 'array'],
            'images.*'        => ['image', 'max:4096'],
        ]);

        // specs/accessories arrive as a JSON string when sent via FormData
        $specs       = is_string($request->input('specs'))       ? json_decode($request->input('specs'), true)       : $request->input('specs', []);
        $accessories = is_string($request->input('accessories')) ? json_decode($request->input('accessories'), true) : $request->input('accessories', []);

        $uploadedPaths = [];
        $requestId = uniqid('img-', true);

        try {
            $product = DB::transaction(function () use ($validated, $specs, $accessories, $request, &$uploadedPaths, $requestId) {
                $product = Product::create([
                    ...$validated,
                    'slug'        => Str::slug($validated['name']),
                    'specs'       => $specs ?? [],
                    'accessories' => $accessories ?? [],
                    'is_featured' => $validated['is_featured'] ?? false,
                    'is_active'   => $validated['is_active'] ?? true,
                    'sort_order'  => $validated['sort_order'] ?? 0,
                ]);

                foreach ($request->file('images', []) as $index => $file) {
                    $imagePath = $this->storeProductImage($file, $uploadedPaths, 'create', $requestId);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'alt'        => $product->name,
                        'sort_order' => $index,
                    ]);
                }

                return $product;
            });
        } catch (ProductImageStorageException) {
            $this->cleanupUploadedProductImages($uploadedPaths, 'create', $requestId);

            return response()->json(['message' => 'Unable to store product image.'], 500);
        } catch (Throwable $exception) {
            $this->cleanupUploadedProductImages($uploadedPaths, 'create', $requestId);

            throw $exception;
        }

        return (new ProductResource($product->load('images', 'category')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Product $product): ProductResource|JsonResponse
    {
        $validated = $request->validate([
            'category_id'     => ['sometimes', 'exists:categories,id'],
            'brand'           => ['sometimes', 'string', 'max:120'],
            'name'            => ['sometimes', 'string', 'max:160'],
            'sku'             => ['sometimes', 'string', 'max:60', 'unique:products,sku,' . $product->id],
            'short_description' => ['sometimes', 'string', 'max:255'],
            'description'     => ['sometimes', 'string'],
            'price'           => ['nullable', 'numeric'],
            'is_featured'     => ['sometimes', 'boolean'],
            'is_active'       => ['sometimes', 'boolean'],
            'sort_order'      => ['sometimes', 'integer'],
            'images'          => ['nullable', 'array'],
            'images.*'        => ['image', 'max:4096'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // specs/accessories arrive as a JSON string when sent via FormData
        if ($request->has('specs')) {
            $validated['specs'] = is_string($request->input('specs')) ? json_decode($request->input('specs'), true) : $request->input('specs', []);
        }
        if ($request->has('accessories')) {
            $validated['accessories'] = is_string($request->input('accessories')) ? json_decode($request->input('accessories'), true) : $request->input('accessories', []);
        }

        unset($validated['images']);

        $uploadedPaths = [];
        $requestId = uniqid('img-', true);

        try {
            DB::transaction(function () use ($request, $product, $validated, &$uploadedPaths, $requestId) {
                foreach ($request->file('images', []) as $index => $file) {
                    $existingCount = $product->images()->count();
                    $imagePath = $this->storeProductImage($file, $uploadedPaths, 'update', $requestId);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'alt'        => $product->name,
                        'sort_order' => $existingCount + $index,
                    ]);
                }

                $product->update($validated);
            });
        } catch (ProductImageStorageException) {
            $this->cleanupUploadedProductImages($uploadedPaths, 'update', $requestId);

            return response()->json(['message' => 'Unable to store product image.'], 500);
        } catch (Throwable $exception) {
            $this->cleanupUploadedProductImages($uploadedPaths, 'update', $requestId);

            throw $exception;
        }

        return new ProductResource($product->load('images', 'category'));
    }

    /**
     * Store an image with the same generated products/{hash}.{extension} path
     * used by UploadedFile::store(), recording the attempted key for rollback cleanup.
     */
    private function storeProductImage(UploadedFile $file, array &$uploadedPaths, string $operation, string $requestId): string
    {
        $fileName = $file->hashName();
        $attemptedPath = 'products/'.$fileName;
        $uploadedPaths[] = $attemptedPath;

        $config = config('filesystems.disks.public');
        Log::channel('stderr')->info('Product image storage configuration check', [
            'request_id' => $requestId,
            'has_key' => !empty($config['key']),
            'has_secret' => !empty($config['secret']),
            'has_endpoint' => !empty($config['endpoint']),
            'has_bucket' => !empty($config['bucket']),
        ]);

        try {
            $imagePath = $file->storeAs('products', $fileName, 'public');
            Log::channel('stderr')->info('Product image storage operation completed', [
                'request_id' => $requestId,
            ]);
        } catch (Throwable $exception) {
            $this->logStorageFailure($exception, $operation, 'write', $requestId);

            throw new ProductImageStorageException;
        }

        if (! is_string($imagePath) || $imagePath === '') {
            Log::channel('stderr')->error('Product image storage returned no path.', [
                'operation' => $operation,
                'request_id' => $requestId,
            ]);

            throw new ProductImageStorageException;
        }

        $uploadedPaths[array_key_last($uploadedPaths)] = $imagePath;

        return $imagePath;
    }

    private function cleanupUploadedProductImages(array $uploadedPaths, string $operation, string $requestId): void
    {
        foreach (array_reverse(array_values(array_unique($uploadedPaths))) as $path) {
            try {
                if (! Storage::disk('public')->delete($path)) {
                    Log::channel('stderr')->warning('Product image cleanup returned no confirmation.', [
                        'operation' => $operation,
                        'request_id' => $requestId,
                    ]);
                }
            } catch (Throwable $exception) {
                $this->logStorageFailure($exception, $operation, 'cleanup', $requestId);
            }
        }
    }

    private function logStorageFailure(Throwable $exception, string $operation, string $action = 'write', string $requestId = ''): void
    {
        $exceptionClasses = [];
        $awsErrorCode = null;
        $awsHttpStatus = null;
        $curlErrorCode = null;
        $current = $exception;

        for ($depth = 0; $current !== null && $depth < 8; $depth++, $current = $current->getPrevious()) {
            $exceptionClasses[] = get_class($current);

            if ($current instanceof AwsException) {
                if ($awsErrorCode === null) {
                    $candidate = $current->getAwsErrorCode();

                    if (is_string($candidate) && in_array($candidate, self::SAFE_AWS_ERROR_CODES, true)) {
                        $awsErrorCode = $candidate;
                    }
                }

                if ($awsHttpStatus === null) {
                    $statusCode = $current->getResponse()?->getStatusCode();

                    if (is_int($statusCode) && $statusCode >= 100 && $statusCode <= 599) {
                        $awsHttpStatus = $statusCode;
                    }
                }
            }

            if ($curlErrorCode === null && preg_match('/cURL error\\s+([0-9]{1,3})\\b/i', $current->getMessage(), $matches)) {
                $curlErrorCode = $matches[1];
            }
        }

        Log::channel('stderr')->error($action === 'cleanup' ? 'Product image cleanup failed.' : 'Product image storage failed.', [
            'operation' => $operation,
            'action' => $action,
            'request_id' => $requestId,
            'exception_class' => get_class($exception),
            'exception_chain' => array_values(array_unique($exceptionClasses)),
            'aws_error_code' => $awsErrorCode,
            'aws_http_status' => $awsHttpStatus,
            'curl_error_code' => $curlErrorCode,
        ]);
    }

    public function destroyImage(Product $product, ProductImage $image): JsonResponse
    {
        // Make sure the image actually belongs to this product
        if ($image->product_id !== $product->id) {
            return response()->json(['message' => 'Image does not belong to this product.'], 403);
        }

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image deleted.']);
    }

    public function destroy(Product $product): JsonResponse
    {
        // Remove all stored image files
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
