<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SocialLinkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'platform' => $this->platform,
            'label' => $this->label,
            'url' => $this->url,
            'icon' => $this->icon,
            'sortOrder' => $this->sort_order,
            'isActive' => $this->is_active,
        ];
    }
}
