<?php

namespace Tests\Feature;

require_once __DIR__ . '/../TestCase.php';

use Database\Seeders\HeroSectionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class HeroApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_hero_endpoint_returns_active_items(): void
    {
        (new HeroSectionSeeder())->run();

        $response = $this->getJson('/api/hero');

        $response->assertOk()
            ->assertJsonPath('data.0.title', 'Communication Infrastructure');
    }
}
