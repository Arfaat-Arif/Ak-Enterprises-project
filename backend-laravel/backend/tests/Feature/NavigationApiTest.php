<?php

namespace Tests\Feature;

require_once __DIR__ . '/../TestCase.php';

use Database\Seeders\NavigationItemSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class NavigationApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_navigation_endpoint_returns_active_items(): void
    {
        (new NavigationItemSeeder())->run();

        $response = $this->getJson('/api/navigation');

        $response->assertOk()
            ->assertJsonPath('data.0.label', 'Home');
    }
}
