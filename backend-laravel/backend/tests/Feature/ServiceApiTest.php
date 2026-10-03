<?php

namespace Tests\Feature;

require_once __DIR__ . '/../TestCase.php';

use App\Models\Service;
use App\Models\User;
use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ServiceApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_service_endpoint_returns_active_items(): void
    {
        (new ServiceSeeder())->run();

        $response = $this->getJson('/api/services');

        $response->assertOk()
            ->assertJsonPath('data.0.name', 'CCTV Surveillance Systems')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'shortDescription',
                        'description',
                        'imageUrl',
                        'icon',
                        'url',
                        'sortOrder',
                        'isFeatured',
                        'isActive',
                    ],
                ],
            ]);
    }

    public function test_public_service_endpoint_excludes_inactive_items(): void
    {
        Service::create([
            'name' => 'Inactive Service',
            'slug' => 'inactive-service',
            'is_active' => false,
            'sort_order' => 100,
        ]);

        Service::create([
            'name' => 'Active Test Service',
            'slug' => 'active-test-service',
            'is_active' => true,
            'sort_order' => 101,
        ]);

        $response = $this->getJson('/api/services');

        $response->assertOk();
        $slugs = collect($response->json('data'))->pluck('slug')->all();
        $this->assertNotContains('inactive-service', $slugs);
        $this->assertContains('active-test-service', $slugs);
    }

    public function test_unauthenticated_user_cannot_access_admin_services(): void
    {
        $this->getJson('/api/admin/services')->assertUnauthorized();
        $this->postJson('/api/admin/services', [])->assertUnauthorized();
    }

    public function test_non_admin_user_cannot_access_admin_services(): void
    {
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user_' . uniqid() . '@example.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->getJson('/api/admin/services')->assertForbidden();
    }

    public function test_admin_can_perform_full_services_crud(): void
    {
        Storage::fake('public');

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_' . uniqid() . '@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);
        $token = $admin->createToken('test')->plainTextToken;

        // CREATE
        $createResponse = $this->withToken($token)->postJson('/api/admin/services', [
            'name' => 'Biometric Screening',
            'short_description' => 'Fast access biometrics',
            'description' => "Fingerprint scanners\nFacial recognition",
            'icon' => 'Fingerprint',
            'url' => '/services/biometrics',
            'sort_order' => 5,
            'is_featured' => 1,
            'is_active' => 1,
            'image' => UploadedFile::fake()->create('biometrics.jpg', 100, 'image/jpeg'),
        ]);

        $createResponse->assertCreated();
        $serviceId = $createResponse->json('data.id');
        $this->assertDatabaseHas('services', [
            'id' => $serviceId,
            'name' => 'Biometric Screening',
            'slug' => 'biometric-screening',
            'sort_order' => 5,
        ]);

        $createdService = Service::find($serviceId);
        $this->assertNotNull($createdService->image_path);
        Storage::disk('public')->assertExists($createdService->image_path);

        // READ (INDEX)
        $indexResponse = $this->withToken($token)->getJson('/api/admin/services');
        $indexResponse->assertOk();
        $this->assertContains('Biometric Screening', collect($indexResponse->json('data'))->pluck('name')->all());

        // READ (SHOW)
        $this->withToken($token)->getJson("/api/admin/services/{$serviceId}")
            ->assertOk()
            ->assertJsonPath('data.name', 'Biometric Screening');

        // UPDATE WITH NEW IMAGE (REPLACEMENT)
        $oldImagePath = $createdService->image_path;
        $updateResponse = $this->withToken($token)->postJson("/api/admin/services/{$serviceId}", [
            '_method' => 'PUT',
            'name' => 'Biometric Screening Advanced',
            'short_description' => 'Updated short description',
            'sort_order' => 10,
            'is_featured' => 0,
            'is_active' => 1,
            'image' => UploadedFile::fake()->create('biometrics_new.jpg', 100, 'image/jpeg'),
        ]);

        $updateResponse->assertOk()
            ->assertJsonPath('data.name', 'Biometric Screening Advanced')
            ->assertJsonPath('data.sortOrder', 10);

        $updatedService = Service::find($serviceId);
        $this->assertNotEquals($oldImagePath, $updatedService->image_path);
        Storage::disk('public')->assertMissing($oldImagePath);
        Storage::disk('public')->assertExists($updatedService->image_path);

        // DELETE (AND MEDIA CLEANUP)
        $deleteResponse = $this->withToken($token)->deleteJson("/api/admin/services/{$serviceId}");
        $deleteResponse->assertOk();

        $this->assertDatabaseMissing('services', [
            'id' => $serviceId,
        ]);
        Storage::disk('public')->assertMissing($updatedService->image_path);
    }

    public function test_service_validation_rules(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_' . uniqid() . '@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);
        $token = $admin->createToken('test')->plainTextToken;

        // Name is required
        $this->withToken($token)->postJson('/api/admin/services', [
            'name' => '',
        ])->assertUnprocessable()->assertJsonValidationErrors(['name']);

        // Invalid URL scheme (e.g. javascript:)
        $this->withToken($token)->postJson('/api/admin/services', [
            'name' => 'Test Service',
            'url' => 'javascript:alert(1)',
        ])->assertUnprocessable()->assertJsonValidationErrors(['url']);
    }
}
