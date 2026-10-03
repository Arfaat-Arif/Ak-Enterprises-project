<?php

namespace Database\Seeders;

use App\Models\HeroSection;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    public function run(): void
    {
        HeroSection::updateOrCreate(
            ['title' => 'Communication Infrastructure'],
            [
                'description' => 'Motorola, Hytera, ICOM and Baofeng radios, base stations, repeaters, and CCTV security systems — sourced, configured and supported for government and enterprise deployments.',
                'badge' => "Pakistan's Premier Telecom & Security Supplier",
                'background_video_path' => '/video/merge 1.mp4',
                'primary_button_text' => 'Browse Products',
                'primary_button_url' => '/products',
                'secondary_button_text' => 'Request a Quote',
                'secondary_button_url' => '/contact',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );
    }
}
