<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $services = Service::query()
            ->orderBy('sort_order')
            ->get();

        return ServiceResource::collection($services);
    }

    public function show(Service $service): ServiceResource
    {
        return new ServiceResource($service);
    }

    public function store(Request $request): ServiceResource
    {
        $validated = $this->validateRequest($request);
        $service = Service::create($validated);

        return new ServiceResource($service->refresh());
    }

    public function update(Request $request, Service $service): ServiceResource
    {
        $validated = $this->validateRequest($request, $service);
        $service->update($validated);

        return new ServiceResource($service->refresh());
    }

    public function destroy(Service $service): JsonResponse
    {
        $this->deleteMedia($service->image_path);
        $service->delete();

        return response()->json(['message' => 'Service deleted.']);
    }

    protected function validateRequest(Request $request, ?Service $service = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => [
                'nullable',
                'string',
                'max:120',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('services', 'slug')->ignore($service?->id),
            ],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'icon' => ['nullable', 'string', 'max:100'],
            'url' => ['nullable', 'string', 'max:255', $this->serviceUrlRule()],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $this->deleteMedia($service?->image_path);
            $data['image_path'] = $request->file('image')->store('services', 'public');
        }

        if (! array_key_exists('image_path', $data) && $service) {
            $data['image_path'] = $service->image_path;
        }

        if (empty($data['slug'] ?? null) && ! empty($data['name'])) {
            $data['slug'] = strtolower(str_replace(['&', '/', ' '], ['and', '-', '-'], $data['name']));
            $data['slug'] = preg_replace('/[^a-z0-9-]+/', '-', $data['slug']);
            $data['slug'] = trim((string) preg_replace('/-+/', '-', $data['slug']), '-');

            $slugTaken = Service::query()
                ->where('slug', $data['slug'])
                ->when($service, fn ($query) => $query->where('id', '!=', $service->id))
                ->exists();

            if ($slugTaken) {
                throw ValidationException::withMessages([
                    'slug' => ['The slug has already been taken.'],
                ]);
            }
        }

        $data['short_description'] = $data['short_description'] ?? null;
        $data['description'] = $data['description'] ?? null;
        $data['icon'] = $data['icon'] ?? null;
        $data['url'] = $data['url'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;

        unset($data['image']);

        return $data;
    }

    protected function serviceUrlRule(): \Closure
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
