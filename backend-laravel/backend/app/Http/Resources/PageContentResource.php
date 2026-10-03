<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pageKey' => $this->page_key,
            'sectionKey' => $this->section_key,
            'content' => $this->content,
            'isActive' => $this->is_active,
        ];
    }
}
