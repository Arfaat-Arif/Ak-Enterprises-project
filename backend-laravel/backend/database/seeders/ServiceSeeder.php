<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'CCTV Surveillance Systems',
                'slug' => 'cctv-surveillance-systems',
                'short_description' => 'Design and supply of IP and analog CCTV systems for offices, facilities, and public sites.',
                'description' => "HD & 4K IP cameras\nNVR/DVR sizing & storage planning\nRemote monitoring setup",
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Access Control',
                'slug' => 'access-control',
                'short_description' => 'Card, biometric, and PIN-based access control for restricted areas and government facilities.',
                'description' => "Door controllers & readers\nVisitor management integration\nMulti-site access policies",
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'name' => 'Alarm & Perimeter Security',
                'slug' => 'alarm-perimeter-security',
                'short_description' => 'Intrusion detection and perimeter alarm systems paired with your existing radio network.',
                'description' => "Motion & perimeter sensors\nIntegration with guard dispatch radios\n24/7 alert routing",
                'sort_order' => 3,
                'is_featured' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                [
                    'name' => $service['name'],
                    'short_description' => $service['short_description'],
                    'description' => $service['description'],
                    'sort_order' => $service['sort_order'],
                    'is_featured' => $service['is_featured'],
                    'is_active' => true,
                ]
            );
        }
    }
}
