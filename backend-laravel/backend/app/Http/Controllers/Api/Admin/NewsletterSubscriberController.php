<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsletterSubscriberController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return JsonResource::collection(
            NewsletterSubscriber::query()->latest()->paginate(20)
        );
    }
}
