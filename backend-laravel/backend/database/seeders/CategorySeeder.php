<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Motorola Radios', 'slug' => 'motorola-radios', 'type' => 'brand', 'is_featured' => true, 'sort_order' => 1],
            ['name' => 'Hytera Radios', 'slug' => 'hytera-radios', 'type' => 'brand', 'is_featured' => true, 'sort_order' => 2],
            ['name' => 'ICOM Radios', 'slug' => 'icom-radios', 'type' => 'brand', 'is_featured' => true, 'sort_order' => 3],
            ['name' => 'Baofeng', 'slug' => 'baofeng', 'type' => 'brand', 'is_featured' => true, 'sort_order' => 4],
            ['name' => 'Hand Held Radios', 'slug' => 'hand-held-radios', 'type' => 'product_type', 'is_featured' => false, 'sort_order' => 5],
            ['name' => 'Base & Vehicle Stations', 'slug' => 'base-vehicle-stations', 'type' => 'product_type', 'is_featured' => false, 'sort_order' => 6],
            ['name' => 'Repeaters', 'slug' => 'repeaters', 'type' => 'product_type', 'is_featured' => false, 'sort_order' => 7],
            ['name' => 'CCTV & Security', 'slug' => 'cctv-security', 'type' => 'security', 'is_featured' => false, 'sort_order' => 8],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
