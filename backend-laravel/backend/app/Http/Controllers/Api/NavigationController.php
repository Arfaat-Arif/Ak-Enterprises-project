<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NavigationItemResource;
use App\Models\NavigationItem;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NavigationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = NavigationItem::query()
            ->with('children')
            ->active()
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return NavigationItemResource::collection($items);
    }
}
