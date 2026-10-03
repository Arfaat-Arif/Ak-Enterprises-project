<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class InquiryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return JsonResource::collection(
            Inquiry::query()->with('product')->latest()->paginate(20)
        );
    }
}
