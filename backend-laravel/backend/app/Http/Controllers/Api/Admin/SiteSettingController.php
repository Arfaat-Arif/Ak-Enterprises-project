<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\SiteSettingController as PublicSiteSettingController;
use App\Http\Resources\SiteSettingResource;
use Illuminate\Http\Request;

class SiteSettingController extends PublicSiteSettingController
{
    public function show(): SiteSettingResource
    {
        return parent::show();
    }

    public function update(Request $request): SiteSettingResource
    {
        return parent::update($request);
    }
}
