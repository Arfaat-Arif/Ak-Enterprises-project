<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class InsightResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'imageUrl' => $this->toPublicUrl($this->image_path),
            'publishedAt' => $this->published_at?->toIso8601String(),
            'author' => $this->author,
            'sortOrder' => $this->sort_order,
            'isFeatured' => $this->is_featured,
            'isActive' => $this->is_active,
        ];
    }

    protected function toPublicUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (preg_match('/^(https?:\/\/|\/|data:)/i', $path) === 1) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
