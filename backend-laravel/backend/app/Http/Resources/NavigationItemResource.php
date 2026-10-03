<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'url' => $this->url,
            'parentId' => $this->parent_id,
            'sortOrder' => $this->sort_order,
            'isActive' => $this->is_active,
            'openInNewTab' => $this->open_in_new_tab,
            'children' => NavigationItemResource::collection($this->whenLoaded('children') ?: $this->children),
        ];
    }
}
