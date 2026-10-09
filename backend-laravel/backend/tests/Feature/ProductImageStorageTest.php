<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Aws\CommandInterface;
use Aws\Exception\AwsException;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Psr\Log\LoggerInterface;
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
        $image = UploadedFile::fake()->create('radio.jpg', 100, 'image/jpeg');
        $expectedPath = 'products/'.$image->hashName();
        $this->mockFailedStorage($expectedPath);
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldReceive('error')
            ->once()
            ->with('Product image storage returned no path.', Mockery::on(
                fn (array $context) => ($context['operation'] ?? null) === 'create'
            ));
        Log::shouldReceive('channel')->once()->with('stderr')->andReturn($logger);

        $response = $this->withToken($this->adminToken())->postJson('/api/admin/products', [
            ...$this->productData($category->id),
            'images' => [$image],
        ]);

        $response->assertStatus(500)
            ->assertJsonPath('message', 'Unable to store product image.');
        $this->assertDatabaseMissing('products', ['sku' => 'TEST-RADIO-1']);
        $this->assertDatabaseMissing('product_images', ['image_path' => $expectedPath]);
    }

    public function test_failed_product_image_update_returns_error_without_creating_image_record(): void
    {
        $category = $this->createCategory();
        $product = Product::create($this->productData($category->id));
        $existingImage = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => 'products/existing-image.jpg',
            'alt' => $product->name,
            'sort_order' => 0,
        ]);
        $image = UploadedFile::fake()->create('radio.jpg', 100, 'image/jpeg');
        $expectedPath = 'products/'.$image->hashName();
        $this->mockFailedStorage($expectedPath, true);
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldReceive('error')
            ->once()
            ->with('Product image storage failed.', Mockery::on(function (array $context) {
                return ($context['operation'] ?? null) === 'update'
                    && ($context['action'] ?? null) === 'write'
                    && in_array(AwsException::class, $context['exception_chain'] ?? [], true)
                    && ($context['aws_error_code'] ?? null) === 'AccessDenied'
                    && ! array_key_exists('exception_message', $context)
                    && ! str_contains(json_encode($context), 'diagnostic=must-not-be-logged');
            }));
        Log::shouldReceive('channel')->once()->with('stderr')->andReturn($logger);

        $response = $this->withToken($this->adminToken())->postJson("/api/admin/products/{$product->id}", [
            '_method' => 'PUT',
            'images' => [$image],
        ]);

        $response->assertStatus(500)
            ->assertJsonPath('message', 'Unable to store product image.')
            ->assertDontSee('credential=should-not-be-logged');
        $this->assertDatabaseHas('product_images', ['id' => $existingImage->id]);
        $this->assertDatabaseMissing('product_images', ['image_path' => $expectedPath]);
    }

    private function mockFailedStorage(string $expectedPath, bool $throwException = false): void
    {
        $disk = Mockery::mock(Filesystem::class);
        if ($throwException) {
            $exception = new AwsException(
                'diagnostic=must-not-be-logged',
                Mockery::mock(CommandInterface::class),
                ['code' => 'AccessDenied']
            );
            $disk->shouldReceive('putFileAs')->once()->andThrow($exception);
        } else {
            $disk->shouldReceive('putFileAs')->once()->andReturn(false);
        }
        $disk->shouldReceive('delete')->once()->with($expectedPath)->andReturn(true);

        Storage::shouldReceive('disk')->twice()->with('public')->andReturn($disk);
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
