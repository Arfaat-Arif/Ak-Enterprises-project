<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\CaseStudy;
use App\Models\Category;
use App\Models\Industry;
use App\Models\Inquiry;
use App\Models\Insight;
use App\Models\NewsletterSubscriber;
use App\Models\Product;
use App\Models\Service;
use App\Models\TrustStat;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * GET /api/admin/dashboard/stats
     * Returns summary statistics for the admin dashboard.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'services' => Service::count(),
                'brands' => Brand::count(),
                'industries' => Industry::count(),
                'caseStudies' => CaseStudy::count(),
                'insights' => Insight::count(),
                'trustStats' => TrustStat::count(),
                'inquiries' => Inquiry::count(),
                'newsletterSubscribers' => NewsletterSubscriber::count(),
            ],
        ]);
    }
}
