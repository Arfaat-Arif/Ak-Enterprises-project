<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrustStatResource;
use App\Models\TrustStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class TrustStatController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $trustStats = TrustStat::query()
            ->orderBy('sort_order')
            ->get();

        return TrustStatResource::collection($trustStats);
    }

    public function show(TrustStat $trustStat): TrustStatResource
    {
        return new TrustStatResource($trustStat);
    }

    public function store(Request $request): TrustStatResource
    {
        $validated = $this->validateRequest($request);
        $trustStat = TrustStat::create($validated);

        return new TrustStatResource($trustStat->refresh());
    }

    public function update(Request $request, TrustStat $trustStat): TrustStatResource
    {
        $validated = $this->validateRequest($request, $trustStat);
        $trustStat->update($validated);

        return new TrustStatResource($trustStat->refresh());
    }

    public function destroy(TrustStat $trustStat): JsonResponse
    {
        $trustStat->delete();

        return response()->json(['message' => 'Trust statistic deleted.']);
    }

    protected function validateRequest(Request $request, ?TrustStat $trustStat = null): array
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'value' => ['required', 'integer', 'min:0'],
            'suffix' => ['nullable', 'string', 'max:10'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['suffix'] = $data['suffix'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        return $data;
    }
}
