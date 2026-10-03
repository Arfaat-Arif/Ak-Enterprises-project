<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category_slug' => 'motorola-radios',
                'brand' => 'Motorola',
                'name' => 'MOTOTRBO R7 Portable Radio',
                'sku' => 'MT-R7-001',
                'short_description' => 'Rugged, IP68-rated digital portable radio built for mission-critical teams.',
                'description' => 'The MOTOTRBO R7 is a digital two-way radio designed for durability and clarity in the toughest environments. It offers best-in-class audio, a bright sunlight-readable display, and a rugged IP68 rating for dust and water resistance, making it suited for government, security, and industrial deployments.',
                'specs' => [
                    ['label' => 'Frequency Range', 'value' => 'VHF 136-174 MHz / UHF 403-527 MHz'],
                    ['label' => 'Ingress Protection', 'value' => 'IP68'],
                    ['label' => 'Battery Life', 'value' => 'Up to 28 hours (IMPRES Li-ion)'],
                    ['label' => 'Display', 'value' => '2" full-color sunlight-readable'],
                    ['label' => 'Audio Output', 'value' => '1W loud, clear audio'],
                    ['label' => 'Channel Capacity', 'value' => 'Up to 1,000 channels'],
                ],
                'accessories' => ['IMPRES 2 charger', 'Remote speaker microphone', 'Carry holster', 'Multi-unit charger'],
                'is_featured' => true,
            ],
            [
                'category_slug' => 'hytera-radios',
                'brand' => 'Hytera',
                'name' => 'Hytera PD715 Digital Radio',
                'sku' => 'HY-PD715',
                'short_description' => 'Compact DMR digital portable radio for everyday field operations.',
                'description' => 'The Hytera PD715 delivers reliable DMR digital communication in a compact form factor, ideal for retail, hospitality, and light industrial teams that need dependable coverage without bulky hardware.',
                'specs' => [
                    ['label' => 'Frequency Range', 'value' => 'VHF 136-174 MHz / UHF 400-470 MHz'],
                    ['label' => 'Ingress Protection', 'value' => 'IP54'],
                    ['label' => 'Battery Life', 'value' => 'Up to 20 hours'],
                    ['label' => 'Channel Capacity', 'value' => 'Up to 32 channels'],
                ],
                'accessories' => ['Standard charger', 'Earpiece', 'Belt clip'],
                'is_featured' => true,
            ],
            [
                'category_slug' => 'icom-radios',
                'brand' => 'ICOM',
                'name' => 'ICOM IC-F1000 Analog Radio',
                'sku' => 'IC-F1000',
                'short_description' => 'Entry-level rugged analog radio with intuitive controls.',
                'description' => 'The ICOM IC-F1000 is a straightforward analog portable radio built for teams that need simple, reliable push-to-talk communication without a steep learning curve.',
                'specs' => [
                    ['label' => 'Frequency Range', 'value' => 'VHF 136-174 MHz'],
                    ['label' => 'Ingress Protection', 'value' => 'IP54'],
                    ['label' => 'Battery Life', 'value' => 'Up to 14.5 hours'],
                    ['label' => 'Channel Capacity', 'value' => 'Up to 16 channels'],
                ],
                'accessories' => ['Drop-in charger', 'Swivel belt clip'],
                'is_featured' => true,
            ],
            [
                'category_slug' => 'baofeng',
                'brand' => 'Baofeng',
                'name' => 'Baofeng UV-5R Dual Band Radio',
                'sku' => 'BF-UV5R',
                'short_description' => 'Affordable dual-band handheld for general-purpose communication.',
                'description' => 'The Baofeng UV-5R is a widely used dual-band VHF/UHF handheld radio, popular for general-purpose and budget-conscious deployments where basic two-way communication is the priority.',
                'specs' => [
                    ['label' => 'Frequency Range', 'value' => 'VHF 136-174 MHz / UHF 400-480 MHz'],
                    ['label' => 'Battery Life', 'value' => 'Up to 16 hours'],
                    ['label' => 'Channel Capacity', 'value' => 'Up to 128 channels'],
                ],
                'accessories' => ['USB charging dock', 'Antenna', 'Earpiece'],
                'is_featured' => false,
            ],
        ];

        foreach ($products as $data) {
            $category = Category::where('slug', $data['category_slug'])->firstOrFail();

            $product = Product::updateOrCreate(
                ['sku' => $data['sku']],
                [
                    'category_id' => $category->id,
                    'brand' => $data['brand'],
                    'name' => $data['name'],
                    'slug' => \Illuminate\Support\Str::slug($data['name']),
                    'short_description' => $data['short_description'],
                    'description' => $data['description'],
                    'specs' => $data['specs'],
                    'accessories' => $data['accessories'],
                    'price' => null,
                    'is_featured' => $data['is_featured'],
                    'is_active' => true,
                ]
            );

            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    // Placeholder path — replace with a real uploaded image
                    // via the admin panel or storage/app/public/products.
                    'image_path' => 'products/placeholder.jpg',
                    'alt' => $product->name,
                    'sort_order' => 1,
                ]);
            }
        }
    }
}
