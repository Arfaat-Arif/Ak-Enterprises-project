<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\InsightResource;
use App\Models\Insight;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class InsightController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $insights = Insight::query()
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->get();

        return InsightResource::collection($insights);
    }

    public function show(Insight $insight): InsightResource
    {
        return new InsightResource($insight);
    }

    public function store(Request $request): InsightResource
    {
        $validated = $this->validateRequest($request);
        $insight = Insight::create($validated);

        return new InsightResource($insight->refresh());
    }

    public function update(Request $request, Insight $insight): InsightResource
    {
        $validated = $this->validateRequest($request, $insight);
        $insight->update($validated);

        return new InsightResource($insight->refresh());
    }

    public function destroy(Insight $insight): JsonResponse
    {
        $this->deleteMedia($insight->image_path);
        $insight->delete();

        return response()->json(['message' => 'Insight deleted.']);
    }

    protected function validateRequest(Request $request, ?Insight $insight = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'slug' => [
                'nullable',
                'string',
                'max:120',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('insights', 'slug')->ignore($insight?->id),
            ],
            'excerpt' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:10000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'published_at' => ['nullable', 'date'],
            'author' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $this->deleteMedia($insight?->image_path);
            $data['image_path'] = $request->file('image')->store('insights', 'public');
        }

        if (! array_key_exists('image_path', $data) && $insight) {
            $data['image_path'] = $insight->image_path;
        }

        if (empty($data['slug'] ?? null) && ! empty($data['title'])) {
            $data['slug'] = strtolower(str_replace(['&', '/', ' '], ['and', '-', '-'], $data['title']));
            $data['slug'] = preg_replace('/[^a-z0-9-]+/', '-', $data['slug']);
            $data['slug'] = trim((string) preg_replace('/-+/', '-', $data['slug']), '-');

            $slugTaken = Insight::query()
                ->where('slug', $data['slug'])
                ->when($insight, fn ($query) => $query->where('id', '!=', $insight->id))
                ->exists();

            if ($slugTaken) {
                throw ValidationException::withMessages([
                    'slug' => ['The slug has already been taken.'],
                ]);
            }
        }

        $data['excerpt'] = $data['excerpt'] ?? null;
        $data['content'] = $data['content'] ?? null;
        $data['published_at'] = $data['published_at'] ?? null;
        $data['author'] = $data['author'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;

        unset($data['image']);

        return $data;
    }

    protected function deleteMedia(?string $path): void
    {
        if (! $path || preg_match('/^(https?:\/\/|\/|data:)/i', $path) === 1) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
