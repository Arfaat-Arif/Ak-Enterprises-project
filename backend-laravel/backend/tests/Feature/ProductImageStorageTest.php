<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class ProductImageStorageTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_can_create_product_with_a_stored_image(): void
    {
        Storage::fake('public');

        $category = $this->createCategory();
        $response = $this->withToken($this->adminToken())->postJson('/api/admin/products', [
            ...$this->productData($category->id),
            'images' => [UploadedFile::fake()->create('radio.jpg', 100, 'image/jpeg')],
        ]);

        $response->assertCreated()->assertJsonStructure([
            'data' => ['images' => [['id', 'url', 'alt', 'sortOrder']]],
        ]);

        $productImage = ProductImage::where('product_id', $response->json('data.id'))->firstOrFail();
        $this->assertStringStartsWith('products/', $productImage->image_path);
        Storage::disk('public')->assertExists($productImage->image_path);
    }

    public function test_failed_product_image_storage_returns_error_without_creating_image_record(): void
    {
        $category = $this->createCategory();
        $this->mockFailedStorage();

        $response = $this->withToken($this->adminToken())->postJson('/api/admin/products', [
            ...$this->productData($category->id),
            'images' => [UploadedFile::fake()->create('radio.jpg', 100, 'image/jpeg')],
        ]);

        $response->assertStatus(500)
            ->assertJsonPath('message', 'Unable to store product image.');
        $product = Product::where('sku', 'TEST-RADIO-1')->firstOrFail();
        $this->assertDatabaseMissing('product_images', ['product_id' => $product->id]);
    }

    public function test_failed_product_image_update_returns_error_without_creating_image_record(): void
    {
        $category = $this->createCategory();
        $product = Product::create($this->productData($category->id));
        $this->mockFailedStorage();

        $response = $this->withToken($this->adminToken())->postJson("/api/admin/products/{$product->id}", [
            '_method' => 'PUT',
            'images' => [UploadedFile::fake()->create('radio.jpg', 100, 'image/jpeg')],
        ]);

        $response->assertStatus(500)
            ->assertJsonPath('message', 'Unable to store product image.');
        $this->assertDatabaseMissing('product_images', ['product_id' => $product->id]);
    }

    private function mockFailedStorage(): void
    {
        $disk = Mockery::mock(Filesystem::class);
        $disk->shouldReceive('putFileAs')->once()->andReturn(false);

        Storage::shouldReceive('disk')->once()->with('public')->andReturn($disk);
    }

    private function createCategory(): Category
    {
        return Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'type' => 'brand',
            'is_active' => true,
        ]);
    }

    private function adminToken(): string
    {
        $admin = User::create([
            'name' => 'Storage Test Admin',
            'email' => sprintf('storage-test-%s@example.com', uniqid()),
            'password' => Hash::make('test-password'),
            'is_admin' => true,
        ]);

        return $admin->createToken('storage-test')->plainTextToken;
    }

    private function productData(int $categoryId): array
    {
        return [
            'category_id' => $categoryId,
            'brand' => 'Test Brand',
            'name' => 'Test Radio',
            'sku' => 'TEST-RADIO-1',
            'short_description' => 'A test radio',
            'description' => 'Storage handling test product.',
        ];
    }
}
