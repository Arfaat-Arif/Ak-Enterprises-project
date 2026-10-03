<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'client_name',
        'summary',
        'description',
        'image_path',
        'url',
        'sort_order',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
