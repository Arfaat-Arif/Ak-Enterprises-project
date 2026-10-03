<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    /**
     * GET /api/products?category=motorola-radios&search=r7&featured=1
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->active()
            ->with(['images', 'category'])
            ->when(
                $request->query('category'),
                fn ($q, $slug) => $q->whereHas('category', fn ($cq) => $cq->where('slug', $slug))
            )
            ->when($request->boolean('featured'), fn ($q) => $q->where('is_featured', true))
            ->when($request->query('search'), function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('name', 'like', "%{$term}%")
                        ->orWhere('brand', 'like', "%{$term}%")
                        ->orWhere('short_description', 'like', "%{$term}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    /**
     * GET /api/products/{slug}
     */
    public function show(string $slug): JsonResource|Response
    {
        $product = Product::query()
            ->active()
            ->with(['images', 'category'])
            ->where('slug', $slug)
            ->first();

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return new ProductResource($product);
    }
}
