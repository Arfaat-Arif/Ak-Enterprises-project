<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        // Seed About page content from existing hardcoded values
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'hero_subtitle'],
            [
                'content' => 'Government contractor and general order supplier for telecom and security equipment.',
                'is_active' => true,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'main_description'],
            [
                'content' => 'supplies telecom equipment, CCTV security systems, and general order items to government departments and enterprise clients. As a registered government contractor and general order supplier, we source directly from leading manufacturers — Motorola, Hytera, ICOM, and Baofeng — and support every deployment from procurement through after-sales service.',
                'is_active' => true,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'what_we_do'],
            [
                'content' => 'Two-way radio supply: handheld, base/vehicle-mounted, and repeater systems\nCCTV and access-control security system design and supply\nGovernment tender and procurement fulfilment\nWarranty support and spare-parts sourcing',
                'is_active' => true,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'why_clients_work_with_us'],
            [
                'content' => 'Every product we list is verified against manufacturer spec sheets before it reaches this catalog, and our quote process is built for procurement teams that need documentation, not just a price.',
                'is_active' => true,
            ]
        );

        // Seed Contact page content
        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'hero_subtitle'],
            [
                'content' => 'Request a quote, ask about government procurement, or reach our sales team directly.',
                'is_active' => true,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'procurement_instructions'],
            [
                'content' => 'Include your tender/RFQ reference number in the message field and our government-sales team will respond with formal documentation.',
                'is_active' => true,
            ]
        );
    }
}
