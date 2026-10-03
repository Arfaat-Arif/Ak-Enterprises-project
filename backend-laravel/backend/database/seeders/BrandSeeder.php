<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Motorola', 'website_url' => 'https://www.motorolasolutions.com', 'sort_order' => 1, 'is_featured' => true],
            ['name' => 'Hytera', 'website_url' => 'https://www.hytera.com', 'sort_order' => 2, 'is_featured' => true],
            ['name' => 'ICOM', 'website_url' => 'https://www.icomjapan.com', 'sort_order' => 3, 'is_featured' => true],
            ['name' => 'Baofeng', 'website_url' => 'https://www.baofengradio.com', 'sort_order' => 4, 'is_featured' => true],
            ['name' => 'Hikvision', 'website_url' => 'https://www.hikvision.com', 'sort_order' => 5, 'is_featured' => false],
            ['name' => 'Dahua', 'website_url' => 'https://www.dahuasecurity.com', 'sort_order' => 6, 'is_featured' => false],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(
                ['name' => $brand['name']],
                [
                    'website_url' => $brand['website_url'],
                    'sort_order' => $brand['sort_order'],
                    'is_featured' => $brand['is_featured'],
                    'is_active' => true,
                ]
            );
        }
    }
}
