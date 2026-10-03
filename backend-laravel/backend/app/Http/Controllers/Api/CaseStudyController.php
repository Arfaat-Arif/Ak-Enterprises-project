<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Models\CaseStudy;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CaseStudyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $caseStudies = CaseStudy::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        return CaseStudyResource::collection($caseStudies);
    }
}
