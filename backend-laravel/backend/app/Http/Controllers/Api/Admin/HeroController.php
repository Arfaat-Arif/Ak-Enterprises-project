<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeroSectionResource;
use App\Models\HeroSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = HeroSection::query()
            ->orderBy('sort_order')
            ->get();

        return HeroSectionResource::collection($items);
    }

    public function store(Request $request): HeroSectionResource
    {
        $validated = $this->validateRequest($request);

        $hero = HeroSection::create($validated);

        return new HeroSectionResource($hero->refresh());
    }

    public function update(Request $request, HeroSection $hero): HeroSectionResource
    {
        $validated = $this->validateRequest($request, $hero);
        $hero->update($validated);

        return new HeroSectionResource($hero->refresh());
    }

    public function destroy(HeroSection $hero): JsonResponse
    {
        $this->deleteMedia($hero->background_image_path);
        $this->deleteMedia($hero->background_video_path);
        $hero->delete();

        return response()->json(['message' => 'Hero section deleted.']);
    }

    protected function validateRequest(Request $request, ?HeroSection $hero = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'badge' => ['nullable', 'string', 'max:255'],
            'background_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'background_video' => ['nullable', 'file', 'mimes:mp4,mov,webm,avi,mkv', 'max:25600'],
            'primary_button_text' => ['nullable', 'string', 'max:120'],
            'primary_button_url' => ['nullable', 'string', 'max:255'],
            'secondary_button_text' => ['nullable', 'string', 'max:120'],
            'secondary_button_url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        foreach (['background_image' => 'background_image_path', 'background_video' => 'background_video_path'] as $fileField => $dbField) {
            if ($request->hasFile($fileField)) {
                $this->deleteMedia($hero?->{$dbField});

                $data[$dbField] = $request->file($fileField)->store('hero', 'public');
            }
        }

        if (! array_key_exists('background_image_path', $data) && $hero) {
            $data['background_image_path'] = $hero->background_image_path;
        }

        if (! array_key_exists('background_video_path', $data) && $hero) {
            $data['background_video_path'] = $hero->background_video_path;
        }

        $data['title'] = $data['title'];
        $data['description'] = $data['description'] ?? null;
        $data['badge'] = $data['badge'] ?? null;
        $data['primary_button_text'] = $data['primary_button_text'] ?? null;
        $data['primary_button_url'] = $data['primary_button_url'] ?? null;
        $data['secondary_button_text'] = $data['secondary_button_text'] ?? null;
        $data['secondary_button_url'] = $data['secondary_button_url'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        unset($data['background_image'], $data['background_video']);

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
