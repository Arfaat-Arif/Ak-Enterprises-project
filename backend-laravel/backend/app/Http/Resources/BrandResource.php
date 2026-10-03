<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BrandResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'logoUrl' => $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null,
            'websiteUrl' => $this->website_url,
            'sortOrder' => $this->sort_order,
            'isFeatured' => $this->is_featured,
            'isActive' => $this->is_active,
        ];
    }
}
