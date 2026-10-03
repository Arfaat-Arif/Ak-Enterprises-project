<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * GET /api/categories?type=brand
     * Only returns active categories.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->when($request->query('type'), fn ($q, $type) => $q->where('type', $type))
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * GET /api/categories/featured
     * Drives the homepage "Top Collections" tiles.
     */
    public function featured(): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }
}
