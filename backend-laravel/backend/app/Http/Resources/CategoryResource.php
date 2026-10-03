<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Field names here are deliberately camelCase to match
 * src/types/category.types.ts on the frontend exactly — no
 * snake_case-to-camelCase translation layer needed in React.
 */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'imageUrl' => $this->image_url,
            'isFeatured' => $this->is_featured,
            'isActive' => $this->is_active,
            'sortOrder' => $this->sort_order,
        ];
    }
}
