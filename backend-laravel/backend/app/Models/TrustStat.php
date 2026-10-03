<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrustStat extends Model
{
    protected $fillable = [
        'label',
        'value',
        'suffix',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'value' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
