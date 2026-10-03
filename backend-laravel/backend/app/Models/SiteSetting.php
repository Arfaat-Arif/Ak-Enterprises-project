<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'tagline',
        'sub_tagline',
        'logo_path',
        'favicon_path',
        'contact_email',
        'contact_phone',
        'address',
        'business_hours',
    ];
}
