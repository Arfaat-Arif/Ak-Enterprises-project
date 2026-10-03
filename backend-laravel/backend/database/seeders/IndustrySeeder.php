<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Seeder;

class IndustrySeeder extends Seeder
{
    public function run(): void
    {
        $industries = [
            [
                'name' => 'Public Safety',
                'slug' => 'public-safety',
                'short_description' => 'Reliable voice and data for teams working under pressure.',
                'description' => 'Reliable voice and data for teams working under pressure.',
                'icon' => 'ShieldCheck',
                'url' => '/security-solutions',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Energy & Utilities',
                'slug' => 'energy-utilities',
                'short_description' => 'Connected operations across complex and remote sites.',
                'description' => 'Connected operations across complex and remote sites.',
                'icon' => 'RadioTower',
                'url' => '/security-solutions',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'name' => 'Manufacturing',
                'slug' => 'manufacturing',
                'short_description' => 'Clear coordination from the plant floor to control room.',
                'description' => 'Clear coordination from the plant floor to control room.',
                'icon' => 'Factory',
                'url' => '/security-solutions',
                'sort_order' => 3,
                'is_featured' => true,
            ],
            [
                'name' => 'Government',
                'slug' => 'government',
                'short_description' => 'Procurement-ready systems for essential public services.',
                'description' => 'Procurement-ready systems for essential public services.',
                'icon' => 'Landmark',
                'url' => '/security-solutions',
                'sort_order' => 4,
                'is_featured' => true,
            ],
            [
                'name' => 'Transport & Logistics',
                'slug' => 'transport-logistics',
                'short_description' => 'Keep people, vehicles and dispatch connected in motion.',
                'description' => 'Keep people, vehicles and dispatch connected in motion.',
                'icon' => 'Truck',
                'url' => '/security-solutions',
                'sort_order' => 5,
                'is_featured' => true,
            ],
            [
                'name' => 'Fire & Emergency',
                'slug' => 'fire-emergency',
                'short_description' => 'Durable communication for fast, coordinated response.',
                'description' => 'Durable communication for fast, coordinated response.',
                'icon' => 'Flame',
                'url' => '/security-solutions',
                'sort_order' => 6,
                'is_featured' => true,
            ],
        ];

        foreach ($industries as $industry) {
            Industry::updateOrCreate(
                ['slug' => $industry['slug']],
                [
                    'name' => $industry['name'],
                    'short_description' => $industry['short_description'],
                    'description' => $industry['description'],
                    'icon' => $industry['icon'],
                    'url' => $industry['url'],
                    'sort_order' => $industry['sort_order'],
                    'is_featured' => $industry['is_featured'],
                    'is_active' => true,
                ]
            );
        }
    }
}
