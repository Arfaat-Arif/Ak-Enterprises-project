<?php

namespace Tests\Feature;

require_once __DIR__ . '/../TestCase.php';

use Database\Seeders\IndustrySeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class IndustryApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_industry_endpoint_returns_active_items(): void
    {
        (new IndustrySeeder())->run();

        $response = $this->getJson('/api/industries');

        $response->assertOk()
            ->assertJsonPath('data.0.name', 'Public Safety');
    }
}
