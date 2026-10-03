<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SiteSettingSeeder::class,
            NavigationItemSeeder::class,
            HeroSectionSeeder::class,
            BrandSeeder::class,
            IndustrySeeder::class,
            ServiceSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CaseStudySeeder::class,
            InsightSeeder::class,
            TrustStatSeeder::class,
            FooterLinkSeeder::class,
            SocialLinkSeeder::class,
            PageContentSeeder::class,
        ]);
    }
}
