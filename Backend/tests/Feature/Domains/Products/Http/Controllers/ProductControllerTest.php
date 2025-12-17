<?php

namespace Tests\Feature\Domains\Products\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    protected UserModel $user;
    protected ProjectModel $project;
    protected ProductModel $product;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = UserModel::factory()->create();
        $this->project = ProjectModel::factory()->create(['user_id' => $this->user->id]);
        $this->product = ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_all_routes()
    {
        $routes = [
            'GET' => '/api/products',
            'POST' => '/api/products',
            'GET' => "/api/products/{$this->product->id}",
            'PUT' => "/api/products/{$this->product->id}",
            'DELETE' => "/api/products/{$this->product->id}",
        ];

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function authenticated_user_can_list_products()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/products');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'description',
                            'type',
                            'status',
                            'price',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]);
    }

    /** @test */
    public function it_can_create_product_with_valid_data()
    {
        $this->actingAs($this->user);

        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'type' => 'landing_page',
            'status' => 'draft',
            'price' => 99.99,
            'project_id' => $this->project->id
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'description',
                    'type',
                    'status',
                    'price'
                ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'type' => 'landing_page',
            'status' => 'draft'
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_product()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/products', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'type', 'project_id']);
    }

    /** @test */
    public function it_can_show_specific_product()
    {
        $this->actingAs($this->user);

        $response = $this->getJson("/api/products/{$this->product->id}");

        $response->assertOk()
                ->assertJson([
                    'id' => $this->product->id,
                    'name' => $this->product->name
                ]);
    }

    /** @test */
    public function it_returns_404_for_non_existent_product()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/products/99999');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_update_product()
    {
        $this->actingAs($this->user);

        $updateData = [
            'name' => 'Updated Product Name',
            'description' => 'Updated Description',
            'status' => 'active'
        ];

        $response = $this->putJson("/api/products/{$this->product->id}", $updateData);

        $response->assertOk()
                ->assertJson([
                    'name' => 'Updated Product Name',
                    'status' => 'active'
                ]);

        $this->assertDatabaseHas('products', [
            'id' => $this->product->id,
            'name' => 'Updated Product Name',
            'status' => 'active'
        ]);
    }

    /** @test */
    public function it_can_delete_product()
    {
        $this->actingAs($this->user);

        $response = $this->deleteJson("/api/products/{$this->product->id}");

        $response->assertOk()
                ->assertJson(['message' => 'Product deleted successfully.']);

        $this->assertDatabaseMissing('products', [
            'id' => $this->product->id
        ]);
    }

    /** @test */
    public function it_can_duplicate_product()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/products/{$this->product->id}/duplicate", [
            'name' => 'Duplicated Product'
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'description'
                    ]
                ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Duplicated Product',
            'project_id' => $this->project->id
        ]);
    }

    /** @test */
    public function it_can_update_product_status()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/products/{$this->product->id}/status", [
            'status' => 'published'
        ]);

        $response->assertOk()
                ->assertJson(['message' => 'Product status updated successfully.']);

        $this->assertDatabaseHas('products', [
            'id' => $this->product->id,
            'status' => 'published'
        ]);
    }

    /** @test */
    public function it_can_update_product_inventory()
    {
        $this->actingAs($this->user);

        $inventoryData = [
            'inventory' => [
                'quantity' => 100,
                'low_stock_threshold' => 10,
                'track_inventory' => true
            ]
        ];

        $response = $this->patchJson("/api/products/{$this->product->id}/inventory", $inventoryData);

        $response->assertOk()
                ->assertJson(['message' => 'Product inventory updated successfully.']);
    }

    /** @test */
    public function it_can_update_product_price()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/products/{$this->product->id}/price", [
            'price' => 149.99,
            'currency' => 'USD'
        ]);

        $response->assertOk()
                ->assertJson(['message' => 'Product price updated successfully.']);
    }

    /** @test */
    public function it_can_get_product_variations()
    {
        $this->actingAs($this->user);

        $response = $this->getJson("/api/products/{$this->product->id}/variations");

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);
    }

    /** @test */
    public function it_can_create_product_variation()
    {
        $this->actingAs($this->user);

        $variationData = [
            'name' => 'Size Large',
            'price' => 129.99,
            'sku' => 'PROD-LG-001',
            'attributes' => ['size' => 'large', 'color' => 'blue'],
            'inventory' => 50
        ];

        $response = $this->postJson("/api/products/{$this->product->id}/variations", $variationData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'name',
                        'price',
                        'sku',
                        'attributes'
                    ]
                ]);
    }

    /** @test */
    public function it_can_upload_product_image()
    {
        $this->actingAs($this->user);
        Storage::fake('public');

        $file = UploadedFile::fake()->image('product.jpg');

        $response = $this->postJson("/api/products/{$this->product->id}/images", [
            'image' => $file,
            'alt_text' => 'Product Image',
            'is_primary' => true
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'filename',
                        'url',
                        'alt_text',
                        'is_primary'
                    ]
                ]);

        Storage::disk('public')->assertExists('products/' . $file->hashName());
    }

    /** @test */
    public function it_can_get_product_reviews()
    {
        $this->actingAs($this->user);

        $response = $this->getJson("/api/products/{$this->product->id}/reviews");

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);
    }

    /** @test */
    public function it_can_create_product_review()
    {
        $this->actingAs($this->user);

        $reviewData = [
            'rating' => 5,
            'title' => 'Great Product!',
            'comment' => 'This product exceeded my expectations.'
        ];

        $response = $this->postJson("/api/products/{$this->product->id}/reviews", $reviewData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'rating',
                        'title',
                        'comment',
                        'user_id'
                    ]
                ]);
    }

    /** @test */
    public function it_can_get_product_analytics()
    {
        $this->actingAs($this->user);

        $response = $this->getJson("/api/products/{$this->product->id}/analytics");

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'views',
                        'conversions',
                        'revenue',
                        'period'
                    ]
                ]);
    }

    /** @test */
    public function it_can_get_product_statistics()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/products/stats');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'total_products',
                        'active_products',
                        'published_products',
                        'draft_products'
                    ]
                ]);
    }

    /** @test */
    public function it_can_bulk_update_products()
    {
        $this->actingAs($this->user);

        $product2 = ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->patchJson('/api/products/bulk-update', [
            'ids' => [$this->product->id, $product2->id],
            'updates' => [
                'status' => 'published',
                'price' => 199.99
            ]
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'updated_count',
                        'failed_count'
                    ]
                ]);

        $this->assertDatabaseHas('products', [
            'id' => $this->product->id,
            'status' => 'published'
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product2->id,
            'status' => 'published'
        ]);
    }

    /** @test */
    public function it_can_bulk_delete_products()
    {
        $this->actingAs($this->user);

        $product2 = ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson('/api/products/bulk-delete', [
            'ids' => [$this->product->id, $product2->id]
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'deleted_count',
                        'failed_count'
                    ]
                ]);

        $this->assertDatabaseMissing('products', [
            'id' => $this->product->id
        ]);

        $this->assertDatabaseMissing('products', [
            'id' => $product2->id
        ]);
    }

    /** @test */
    public function it_can_import_products_from_csv()
    {
        $this->actingAs($this->user);
        Storage::fake('public');

        $csvContent = "name,description,type,price\nTest Product 1,Description 1,landing_page,99.99\nTest Product 2,Description 2,course,199.99";
        $file = UploadedFile::fake()->createWithContent('products.csv', $csvContent);

        $response = $this->postJson('/api/products/import', [
            'file' => $file
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'imported_count',
                        'failed_count',
                        'errors'
                    ]
                ]);
    }

    /** @test */
    public function it_can_export_products()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/products/export?format=csv');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'download_url',
                        'filename',
                        'expires_at'
                    ]
                ]);
    }

    /** @test */
    public function it_can_create_product_bundle()
    {
        $this->actingAs($this->user);

        $product2 = ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $bundleData = [
            'name' => 'Premium Bundle',
            'description' => 'Bundle with multiple products',
            'products' => [$this->product->id, $product2->id],
            'bundle_price' => 249.99
        ];

        $response = $this->postJson('/api/products/bundles', $bundleData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'name',
                        'description',
                        'bundle_price',
                        'products'
                    ]
                ]);
    }

    /** @test */
    public function it_can_get_product_bundles()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/products/bundles');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);
    }

    /** @test */
    public function it_validates_product_ownership()
    {
        $otherUser = UserModel::factory()->create();
        $this->actingAs($otherUser);

        $response = $this->getJson("/api/products/{$this->product->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_filter_products_by_type()
    {
        $this->actingAs($this->user);

        ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'type' => 'course'
        ]);

        $response = $this->getJson('/api/products?type=course');

        $response->assertOk();
        $responseData = $response->json('data');
        
        foreach ($responseData as $product) {
            $this->assertEquals('course', $product['type']);
        }
    }

    /** @test */
    public function it_can_filter_products_by_status()
    {
        $this->actingAs($this->user);

        ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published'
        ]);

        $response = $this->getJson('/api/products?status=published');

        $response->assertOk();
        $responseData = $response->json('data');
        
        foreach ($responseData as $product) {
            $this->assertEquals('published', $product['status']);
        }
    }

    /** @test */
    public function it_can_search_products_by_name()
    {
        $this->actingAs($this->user);

        ProductModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'name' => 'Special Product Name'
        ]);

        $response = $this->getJson('/api/products?search=Special');

        $response->assertOk();
        $responseData = $response->json('data');
        
        $this->assertCount(1, $responseData);
        $this->assertEquals('Special Product Name', $responseData[0]['name']);
    }
}