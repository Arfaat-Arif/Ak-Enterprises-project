<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
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
            $imagePath = $file->store('products', 'public');

            abort_if($imagePath === false, 500, 'Unable to store product image.');

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imagePath,
                'alt'        => $product->name,
                'sort_order' => $index,
            ]);
        }

        return (new ProductResource($product->load('images', 'category')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Product $product): ProductResource
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

        // Upload any new images
        foreach ($request->file('images', []) as $index => $file) {
            $existingCount = $product->images()->count();
            $imagePath = $file->store('products', 'public');

            abort_if($imagePath === false, 500, 'Unable to store product image.');

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imagePath,
                'alt'        => $product->name,
                'sort_order' => $existingCount + $index,
            ]);
        }

        unset($validated['images']);
        $product->update($validated);

        return new ProductResource($product->load('images', 'category'));
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
