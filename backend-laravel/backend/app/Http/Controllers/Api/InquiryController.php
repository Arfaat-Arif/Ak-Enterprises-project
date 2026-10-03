<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewInquiryMail;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * POST /api/inquiries
     * Handles both the general Contact Us form (no product_id) and the
     * per-product "Request a Quote" form (product_id present).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'productId' => ['nullable', 'integer', 'exists:products,id'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'company' => ['nullable', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $inquiry = Inquiry::create([
            'product_id' => $validated['productId'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'message' => $validated['message'],
        ]);

        $notifyAddress = config('mail.contact_notification_address', env('CONTACT_NOTIFICATION_EMAIL'));
        if ($notifyAddress) {
            Mail::to($notifyAddress)->send(new NewInquiryMail($inquiry));
        }

        return response()->json(['message' => 'Inquiry received.'], 201);
    }
}
