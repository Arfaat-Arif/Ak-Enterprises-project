<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FooterLinkResource;
use App\Models\FooterLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class FooterLinkController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $footerLinks = FooterLink::query()
            ->orderBy('group_name')
            ->orderBy('sort_order')
            ->get();

        return FooterLinkResource::collection($footerLinks);
    }

    public function show(FooterLink $footerLink): FooterLinkResource
    {
        return new FooterLinkResource($footerLink);
    }

    public function store(Request $request): FooterLinkResource
    {
        $validated = $this->validateRequest($request);
        $footerLink = FooterLink::create($validated);

        return new FooterLinkResource($footerLink->refresh());
    }

    public function update(Request $request, FooterLink $footerLink): FooterLinkResource
    {
        $validated = $this->validateRequest($request, $footerLink);
        $footerLink->update($validated);

        return new FooterLinkResource($footerLink->refresh());
    }

    public function destroy(FooterLink $footerLink): JsonResponse
    {
        $footerLink->delete();

        return response()->json(['message' => 'Footer link deleted.']);
    }

    protected function validateRequest(Request $request, ?FooterLink $footerLink = null): array
    {
        $data = $request->validate([
            'group_name' => ['required', 'string', 'max:50'],
            'label' => ['required', 'string', 'max:120'],
            'url' => ['required', 'string', 'max:255', $this->urlRule()],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

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
