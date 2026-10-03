<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return BrandResource::collection(
            Brand::query()->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request): BrandResource
    {
        $validated = $this->validateRequest($request);
        $brand = Brand::create($validated);

        return new BrandResource($brand->refresh());
    }

    public function update(Request $request, Brand $brand): BrandResource
    {
        $validated = $this->validateRequest($request, $brand);
        $brand->update($validated);

        return new BrandResource($brand->refresh());
    }

    public function destroy(Brand $brand): JsonResponse
    {
        if ($brand->logo_path) {
            Storage::disk('public')->delete($brand->logo_path);
        }

        $brand->delete();

        return response()->json(['message' => 'Brand deleted.']);
    }

    protected function validateRequest(Request $request, ?Brand $brand = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('logo')) {
            if ($brand?->logo_path) {
                Storage::disk('public')->delete($brand->logo_path);
            }

            $data['logo_path'] = $request->file('logo')->store('brands', 'public');
        }

        if (! array_key_exists('logo_path', $data) && $brand) {
            $data['logo_path'] = $brand->logo_path;
        }

        $data['name'] = $data['name'];
        $data['website_url'] = $data['website_url'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;

        unset($data['logo']);

        return $data;
    }
}
