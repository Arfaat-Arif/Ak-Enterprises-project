<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrustStatResource;
use App\Models\TrustStat;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TrustStatController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $trustStats = TrustStat::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        return TrustStatResource::collection($trustStats);
    }
}
