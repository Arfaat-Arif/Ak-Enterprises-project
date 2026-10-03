<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InsightResource;
use App\Models\Insight;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InsightController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $insights = Insight::query()
            ->active()
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->get();

        return InsightResource::collection($insights);
    }
}
