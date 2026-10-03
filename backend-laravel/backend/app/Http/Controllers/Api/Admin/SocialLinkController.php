<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SocialLinkResource;
use App\Models\SocialLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class SocialLinkController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $socialLinks = SocialLink::query()
            ->orderBy('sort_order')
            ->get();

        return SocialLinkResource::collection($socialLinks);
    }

    public function show(SocialLink $socialLink): SocialLinkResource
    {
        return new SocialLinkResource($socialLink);
    }

    public function store(Request $request): SocialLinkResource
    {
        $validated = $this->validateRequest($request);
        $socialLink = SocialLink::create($validated);

        return new SocialLinkResource($socialLink->refresh());
    }

    public function update(Request $request, SocialLink $socialLink): SocialLinkResource
    {
        $validated = $this->validateRequest($request, $socialLink);
        $socialLink->update($validated);

        return new SocialLinkResource($socialLink->refresh());
    }

    public function destroy(SocialLink $socialLink): JsonResponse
    {
        $socialLink->delete();

        return response()->json(['message' => 'Social link deleted.']);
    }

    protected function validateRequest(Request $request, ?SocialLink $socialLink = null): array
    {
        $data = $request->validate([
            'platform' => ['required', 'string', 'max:50'],
            'label' => ['required', 'string', 'max:120'],
            'url' => ['required', 'string', 'max:255', $this->urlRule()],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['icon'] = $data['icon'] ?? null;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

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
}
