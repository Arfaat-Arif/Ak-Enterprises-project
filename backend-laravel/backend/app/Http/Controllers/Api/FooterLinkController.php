<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FooterLinkResource;
use App\Models\FooterLink;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FooterLinkController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $footerLinks = FooterLink::query()
            ->active()
            ->orderBy('group_name')
            ->orderBy('sort_order')
            ->get();

        return FooterLinkResource::collection($footerLinks);
    }
}
