<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Models\CaseStudy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CaseStudyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $caseStudies = CaseStudy::query()
            ->orderBy('sort_order')
            ->get();

        return CaseStudyResource::collection($caseStudies);
    }

    public function show(CaseStudy $caseStudy): CaseStudyResource
    {
        return new CaseStudyResource($caseStudy);
    }

    public function store(Request $request): CaseStudyResource
    {
        $validated = $this->validateRequest($request);
        $caseStudy = CaseStudy::create($validated);

        return new CaseStudyResource($caseStudy->refresh());
    }

    public function update(Request $request, CaseStudy $caseStudy): CaseStudyResource
    {
        $validated = $this->validateRequest($request, $caseStudy);
        $caseStudy->update($validated);

        return new CaseStudyResource($caseStudy->refresh());
    }

    public function destroy(CaseStudy $caseStudy): JsonResponse
    {
        $this->deleteMedia($caseStudy->image_path);
        $caseStudy->delete();

        return response()->json(['message' => 'Case study deleted.']);
    }

    protected function validateRequest(Request $request, ?CaseStudy $caseStudy = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'slug' => [
                'nullable',
                'string',
                'max:120',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('case_studies', 'slug')->ignore($caseStudy?->id),
            ],
            'client_name' => ['nullable', 'string', 'max:120'],
            'summary' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'url' => ['nullable', 'string', 'max:255', $this->urlRule()],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $this->deleteMedia($caseStudy?->image_path);
            $data['image_path'] = $request->file('image')->store('case-studies', 'public');
        }

        if (! array_key_exists('image_path', $data) && $caseStudy) {
            $data['image_path'] = $caseStudy->image_path;
        }

        if (empty($data['slug'] ?? null) && ! empty($data['title'])) {
            $data['slug'] = strtolower(str_replace(['&', '/', ' '], ['and', '-', '-'], $data['title']));
            $data['slug'] = preg_replace('/[^a-z0-9-]+/', '-', $data['slug']);
            $data['slug'] = trim((string) preg_replace('/-+/', '-', $data['slug']), '-');

            $slugTaken = CaseStudy::query()
                ->where('slug', $data['slug'])
                ->when($caseStudy, fn ($query) => $query->where('id', '!=', $caseStudy->id))
                ->exists();

            if ($slugTaken) {
                throw ValidationException::withMessages([
                    'slug' => ['The slug has already been taken.'],
                ]);
            }
        }

        $data['client_name'] = $data['client_name'] ?? null;
        $data['summary'] = $data['summary'] ?? null;
        $data['description'] = $data['description'] ?? null;
        $data['url'] = $data['url'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;

        unset($data['image']);

        return $data;
    }

    protected function urlRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if ($value === null || $value === '') {
                return;
            }

            $url = trim((string) $value);

            if (preg_match('/^(javascript|data|vbscript):/i', $url) === 1) {
                $fail('The url field contains an unsafe scheme.');
                return;
            }

            if (preg_match('/^https?:\/\//i', $url) === 1) {
                if (filter_var($url, FILTER_VALIDATE_URL) === false) {
                    $fail('The url field must be a valid URL.');
                }
                return;
            }

            if (preg_match('/^\/(?!\/)[\w\-._~\/?#%&=]*$/', $url) !== 1) {
                $fail('The url field must be a valid URL or internal path.');
            }
        };
    }

    protected function deleteMedia(?string $path): void
    {
        if (! $path || preg_match('/^(https?:\/\/|\/|data:)/i', $path) === 1) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
