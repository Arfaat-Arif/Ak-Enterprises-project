<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SiteSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'siteName' => $this->site_name,
            'tagline' => $this->tagline,
            'subTagline' => $this->sub_tagline,
            'logoUrl' => $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null,
            'faviconUrl' => $this->favicon_path ? Storage::disk('public')->url($this->favicon_path) : null,
            'contactEmail' => $this->contact_email,
            'contactPhone' => $this->contact_phone,
            'address' => $this->address,
            'businessHours' => $this->business_hours,
        ];
    }
}
