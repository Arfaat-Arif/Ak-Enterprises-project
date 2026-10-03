<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insight extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'image_path',
        'published_at',
        'author',
        'sort_order',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
