<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeroSectionResource;
use App\Models\HeroSection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HeroController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = HeroSection::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        return HeroSectionResource::collection($items);
    }
}
