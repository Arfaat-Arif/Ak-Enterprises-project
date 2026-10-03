<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Field names here are deliberately camelCase to match
 * src/types/product.types.ts on the frontend exactly. `specs` is stored
 * as JSON [{label, value}], so it passes through unchanged.
 */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'categoryId' => $this->category_id,
            'categorySlug' => $this->category->slug,
            'brand' => $this->brand,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'specs' => $this->specs ?? [],
            'accessories' => $this->accessories ?? [],
            'price' => $this->price !== null ? (float) $this->price : null,
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'isFeatured' => $this->is_featured,
            'isActive' => $this->is_active,
            'sortOrder' => $this->sort_order,
        ];
    }
}
