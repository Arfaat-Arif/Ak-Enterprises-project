<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function show(): SiteSettingResource
    {
        return new SiteSettingResource($this->settings());
    }

    protected function settings(): SiteSetting
    {
        return SiteSetting::query()->firstOrCreate(
            [],
            ['site_name' => 'A.K Enterprises']
        );
    }

    protected function rules(): array
    {
        return [
            'site_name' => ['sometimes', 'required', 'string', 'max:160'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'sub_tagline' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:80'],
            'address' => ['nullable', 'string', 'max:2000'],
            'business_hours' => ['nullable', 'string', 'max:1000'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png,jpg,jpeg,webp,svg', 'max:2048'],
        ];
    }

    public function update(Request $request): SiteSettingResource
    {
        $settings = $this->settings();
        $validated = $request->validate($this->rules());

        foreach (['logo' => 'site-settings/logos', 'favicon' => 'site-settings/favicons'] as $field => $directory) {
            if ($request->hasFile($field)) {
                if ($settings->{$field . '_path'}) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($settings->{$field . '_path'});
                }

                $validated[$field . '_path'] = $request->file($field)->store($directory, 'public');
            }
        }

        unset($validated['logo'], $validated['favicon']);
        $settings->update($validated);

        return new SiteSettingResource($settings->refresh());
    }
}
