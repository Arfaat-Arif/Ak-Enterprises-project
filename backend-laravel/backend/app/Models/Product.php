<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'specs',
        'accessories',
        'price',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'specs' => 'array',
        'accessories' => 'array',
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Only products flagged active should ever reach the public API —
     * controllers should always chain ->active() rather than filtering
     * is_active manually, so a forgotten filter can't leak drafts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
