<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class HeroSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'badge' => $this->badge,
            'backgroundImageUrl' => $this->toPublicUrl($this->background_image_path),
            'backgroundVideoUrl' => $this->toPublicUrl($this->background_video_path),
            'primaryButtonText' => $this->primary_button_text,
            'primaryButtonUrl' => $this->primary_button_url,
            'secondaryButtonText' => $this->secondary_button_text,
            'secondaryButtonUrl' => $this->secondary_button_url,
            'sortOrder' => $this->sort_order,
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
