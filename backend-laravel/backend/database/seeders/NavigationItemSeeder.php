<?php

namespace Database\Seeders;

use App\Models\NavigationItem;
use Illuminate\Database\Seeder;

class NavigationItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'label' => 'Home',
                'url' => '/',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'label' => 'Products',
                'url' => '/products',
                'sort_order' => 2,
                'is_active' => true,
                'children' => [
                    ['label' => 'Handheld Radios', 'url' => '/products?category=hand-held-radios', 'sort_order' => 1],
                    ['label' => 'Security Systems', 'url' => '/security-solutions', 'sort_order' => 2],
                    ['label' => 'Contact Sales', 'url' => '/contact', 'sort_order' => 3],
                ],
            ],
            [
                'label' => 'Services',
                'url' => '/security-solutions',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'label' => 'About',
                'url' => '/about',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'label' => 'Contact Us',
                'url' => '/contact',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($items as $item) {
            $navigationItem = NavigationItem::updateOrCreate(
                ['label' => $item['label'], 'parent_id' => null],
                [
                    'url' => $item['url'],
                    'sort_order' => $item['sort_order'],
                    'is_active' => $item['is_active'],
                    'open_in_new_tab' => false,
                ]
            );

            if (! empty($item['children'])) {
                foreach ($item['children'] as $child) {
                    NavigationItem::updateOrCreate(
                        ['label' => $child['label'], 'parent_id' => $navigationItem->id],
                        [
                            'url' => $child['url'],
                            'sort_order' => $child['sort_order'],
                            'is_active' => true,
                            'open_in_new_tab' => false,
                        ]
                    );
                }
            }
        }
    }
}
