<?php

use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Api\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\CaseStudyController as AdminCaseStudyController;
use App\Http\Controllers\Api\Admin\InsightController as AdminInsightController;
use App\Http\Controllers\Api\Admin\TrustStatController as AdminTrustStatController;
use App\Http\Controllers\Api\Admin\FooterLinkController as AdminFooterLinkController;
use App\Http\Controllers\Api\Admin\SocialLinkController as AdminSocialLinkController;
use App\Http\Controllers\Api\Admin\PageContentController as AdminPageContentController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\IndustryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\NavigationController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\CaseStudyController;
use App\Http\Controllers\Api\InsightController;
use App\Http\Controllers\Api\TrustStatController;
use App\Http\Controllers\Api\FooterLinkController;
use App\Http\Controllers\Api\SocialLinkController;
use App\Http\Controllers\Api\PageContentController;
use App\Http\Controllers\Api\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Api\Admin\HeroController as AdminHeroController;
use App\Http\Controllers\Api\Admin\IndustryController as AdminIndustryController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\NavigationController as AdminNavigationController;
use App\Http\Controllers\Api\Admin\SiteSettingController as AdminSiteSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API routes
|--------------------------------------------------------------------------
| Everything here is what the public React site calls. No auth required —
| this is a browsable catalog, not a members-only storefront.
*/
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/featured', [CategoryController::class, 'featured']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::post('/inquiries', [InquiryController::class, 'store']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::get('/settings', [SiteSettingController::class, 'show']);
Route::get('/navigation', [NavigationController::class, 'index']);
Route::get('/hero', [HeroController::class, 'index']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/industries', [IndustryController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/case-studies', [CaseStudyController::class, 'index']);
Route::get('/insights', [InsightController::class, 'index']);
Route::get('/trust-stats', [TrustStatController::class, 'index']);
Route::get('/footer-links', [FooterLinkController::class, 'index']);
Route::get('/social-links', [SocialLinkController::class, 'index']);
Route::get('/page-content/{pageKey}', [PageContentController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Admin API routes
|--------------------------------------------------------------------------
| /admin/login is public (it's how you get a token). Everything else
| under /admin requires a valid Sanctum token AND the is_admin flag,
| enforced in AdminAuthController@login before the token is even issued.
*/
Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/account', [AdminAuthController::class, 'account']);
    Route::put('/account', [AdminAuthController::class, 'updateAccount']);

    Route::get('/settings', [AdminSiteSettingController::class, 'show']);
    Route::put('/settings', [AdminSiteSettingController::class, 'update']);

    Route::get('/navigation', [AdminNavigationController::class, 'index']);
    Route::post('/navigation', [AdminNavigationController::class, 'store']);
    Route::put('/navigation/{navigation}', [AdminNavigationController::class, 'update']);
    Route::delete('/navigation/{navigation}', [AdminNavigationController::class, 'destroy']);

    Route::get('/hero', [AdminHeroController::class, 'index']);
    Route::post('/hero', [AdminHeroController::class, 'store']);
    Route::put('/hero/{hero}', [AdminHeroController::class, 'update']);
    Route::delete('/hero/{hero}', [AdminHeroController::class, 'destroy']);

    Route::get('/brands', [AdminBrandController::class, 'index']);
    Route::post('/brands', [AdminBrandController::class, 'store']);
    Route::put('/brands/{brand}', [AdminBrandController::class, 'update']);
    Route::delete('/brands/{brand}', [AdminBrandController::class, 'destroy']);

    Route::get('/industries', [AdminIndustryController::class, 'index']);
    Route::post('/industries', [AdminIndustryController::class, 'store']);
    Route::put('/industries/{industry}', [AdminIndustryController::class, 'update']);
    Route::delete('/industries/{industry}', [AdminIndustryController::class, 'destroy']);

    Route::get('/services', [AdminServiceController::class, 'index']);
    Route::post('/services', [AdminServiceController::class, 'store']);
    Route::get('/services/{service}', [AdminServiceController::class, 'show']);
    Route::put('/services/{service}', [AdminServiceController::class, 'update']);
    Route::delete('/services/{service}', [AdminServiceController::class, 'destroy']);

    Route::get('/inquiries', [AdminInquiryController::class, 'index']);
    Route::get('/newsletter-subscribers', [NewsletterSubscriberController::class, 'index']);

    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::get('/categories/{category}', [AdminCategoryController::class, 'show']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

    Route::get('/products', [AdminProductController::class, 'index']);
    Route::get('/products/{product}', [AdminProductController::class, 'show']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::put('/products/{product}', [AdminProductController::class, 'update']);
    Route::delete('/products/{product}/images/{image}', [AdminProductController::class, 'destroyImage']);
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);

    Route::get('/case-studies', [AdminCaseStudyController::class, 'index']);
    Route::get('/case-studies/{caseStudy}', [AdminCaseStudyController::class, 'show']);
    Route::post('/case-studies', [AdminCaseStudyController::class, 'store']);
    Route::put('/case-studies/{caseStudy}', [AdminCaseStudyController::class, 'update']);
    Route::delete('/case-studies/{caseStudy}', [AdminCaseStudyController::class, 'destroy']);

    Route::get('/insights', [AdminInsightController::class, 'index']);
    Route::get('/insights/{insight}', [AdminInsightController::class, 'show']);
    Route::post('/insights', [AdminInsightController::class, 'store']);
    Route::put('/insights/{insight}', [AdminInsightController::class, 'update']);
    Route::delete('/insights/{insight}', [AdminInsightController::class, 'destroy']);

    Route::get('/trust-stats', [AdminTrustStatController::class, 'index']);
    Route::get('/trust-stats/{trustStat}', [AdminTrustStatController::class, 'show']);
    Route::post('/trust-stats', [AdminTrustStatController::class, 'store']);
    Route::put('/trust-stats/{trustStat}', [AdminTrustStatController::class, 'update']);
    Route::delete('/trust-stats/{trustStat}', [AdminTrustStatController::class, 'destroy']);

    Route::get('/footer-links', [AdminFooterLinkController::class, 'index']);
    Route::get('/footer-links/{footerLink}', [AdminFooterLinkController::class, 'show']);
    Route::post('/footer-links', [AdminFooterLinkController::class, 'store']);
    Route::put('/footer-links/{footerLink}', [AdminFooterLinkController::class, 'update']);
    Route::delete('/footer-links/{footerLink}', [AdminFooterLinkController::class, 'destroy']);

    Route::get('/social-links', [AdminSocialLinkController::class, 'index']);
    Route::get('/social-links/{socialLink}', [AdminSocialLinkController::class, 'show']);
    Route::post('/social-links', [AdminSocialLinkController::class, 'store']);
    Route::put('/social-links/{socialLink}', [AdminSocialLinkController::class, 'update']);
    Route::delete('/social-links/{socialLink}', [AdminSocialLinkController::class, 'destroy']);

    Route::get('/page-content', [AdminPageContentController::class, 'index']);
    Route::get('/page-content/{pageContent}', [AdminPageContentController::class, 'show']);
    Route::post('/page-content', [AdminPageContentController::class, 'store']);
    Route::put('/page-content/{pageContent}', [AdminPageContentController::class, 'update']);
    Route::delete('/page-content/{pageContent}', [AdminPageContentController::class, 'destroy']);
});
