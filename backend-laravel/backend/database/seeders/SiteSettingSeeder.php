<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::updateOrCreate(
            [],
            [
                'site_name' => 'A.K Enterprises',
                'tagline' => 'Deals in Telecom Equipment, CCTV Security System & General Order Supplier',
                'sub_tagline' => 'Govt. Contractor General Order Supplier',
                'contact_email' => 'info@akenterprisessec.org',
                'contact_phone' => '+92 300 0000000',
                'address' => null,
                'business_hours' => null,
            ]
        );
    }
}
