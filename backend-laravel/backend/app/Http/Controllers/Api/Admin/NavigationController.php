<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\NavigationItemResource;
use App\Models\NavigationItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NavigationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = NavigationItem::query()
            ->with('children')
            ->orderBy('parent_id')
            ->orderBy('sort_order')
            ->get();

        return NavigationItemResource::collection($items);
    }

    public function store(Request $request): NavigationItemResource
    {
        $validated = $this->validateRequest($request);

        $navigationItem = NavigationItem::create($validated);

        return new NavigationItemResource($navigationItem->refresh());
    }

    public function update(Request $request, NavigationItem $navigation): NavigationItemResource
    {
        $validated = $this->validateRequest($request, $navigation->id);
        $navigation->update($validated);

        return new NavigationItemResource($navigation->refresh());
    }

    public function destroy(NavigationItem $navigation): JsonResponse
    {
        $this->deleteRecursive($navigation);

        return response()->json(['message' => 'Navigation item deleted.']);
    }

    protected function validateRequest(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'url' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:navigation_items,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'open_in_new_tab' => ['nullable', 'boolean'],
        ]);

        if (($data['parent_id'] ?? null) === $ignoreId) {
            abort(422, 'A navigation item cannot be its own parent.');
        }

        if (! empty($data['parent_id'])) {
            $parent = NavigationItem::find($data['parent_id']);
            if ($parent && $parent->id === $ignoreId) {
                abort(422, 'A navigation item cannot be its own parent.');
            }
        }

        return [
            'label' => $data['label'],
            'url' => $data['url'],
            'parent_id' => $data['parent_id'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
            'open_in_new_tab' => $data['open_in_new_tab'] ?? false,
        ];
    }

    protected function deleteRecursive(NavigationItem $navigation): void
    {
        foreach ($navigation->children()->get() as $child) {
            $this->deleteRecursive($child);
        }

        $navigation->delete();
    }
}
