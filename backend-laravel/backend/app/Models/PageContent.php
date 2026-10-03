<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = [
        'page_key',
        'section_key',
        'content',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForPage($query, string $pageKey)
    {
        return $query->where('page_key', $pageKey);
    }
}
