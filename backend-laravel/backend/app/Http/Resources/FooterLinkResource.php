<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FooterLinkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'groupName' => $this->group_name,
            'label' => $this->label,
            'url' => $this->url,
            'sortOrder' => $this->sort_order,
            'isActive' => $this->is_active,
        ];
    }
}
