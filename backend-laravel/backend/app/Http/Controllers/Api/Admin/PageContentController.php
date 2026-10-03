<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageContentResource;
use App\Models\PageContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class PageContentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $pageContents = PageContent::query()
            ->orderBy('page_key')
            ->orderBy('section_key')
            ->get();

        return PageContentResource::collection($pageContents);
    }

    public function show(PageContent $pageContent): PageContentResource
    {
        return new PageContentResource($pageContent);
    }

    public function store(Request $request): PageContentResource
    {
        $validated = $this->validateRequest($request);
        $pageContent = PageContent::create($validated);

        return new PageContentResource($pageContent->refresh());
    }

    public function update(Request $request, PageContent $pageContent): PageContentResource
    {
        $validated = $this->validateRequest($request, $pageContent);
        $pageContent->update($validated);

        return new PageContentResource($pageContent->refresh());
    }

    public function destroy(PageContent $pageContent): JsonResponse
    {
        $pageContent->delete();

        return response()->json(['message' => 'Page content deleted.']);
    }

    protected function validateRequest(Request $request, ?PageContent $pageContent = null): array
    {
        $data = $request->validate([
            'page_key' => ['required', 'string', 'max:50'],
            'section_key' => ['required', 'string', 'max:50'],
            'content' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['content'] = $data['content'] ?? null;
        $data['is_active'] = $data['is_active'] ?? true;

        return $data;
    }
}
