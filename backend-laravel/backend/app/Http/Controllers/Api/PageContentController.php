<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageContentResource;
use App\Models\PageContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageContentController extends Controller
{
    public function show(Request $request, string $pageKey): JsonResponse
    {
        $contents = PageContent::query()
            ->forPage($pageKey)
            ->active()
            ->get();

        $grouped = $contents->mapWithKeys(fn ($item) => [$item->section_key => $item->content]);

        return response()->json(['data' => $grouped]);
    }
}
