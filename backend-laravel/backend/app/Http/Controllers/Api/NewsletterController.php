<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * POST /api/newsletter/subscribe
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:160'],
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $validated['email']],
            ['is_active' => true, 'subscribed_at' => now()]
        );

        return response()->json(['message' => 'Subscribed.'], 201);
    }
}
