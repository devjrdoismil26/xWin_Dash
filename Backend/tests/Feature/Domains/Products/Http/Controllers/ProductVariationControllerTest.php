<?php

namespace Tests\Feature\Domains\Products\Http\Controllers;

use App\Domains\Products\Models\Product;
use App\Domains\Products\Models\ProductVariation;
use App\Domains\Core\Models\User;
use App\Domains\Core\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductVariationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Project $project;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create();
        $this->product = Product::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_list_product_variations()
    {
        ProductVariation::factory()->count(3)->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson('/api/v1/products/variations');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'sku',
                        'price',
                        'formatted_price',
                        'stock_quantity',
                        'status',
                        'created_at',
                    ]
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_product_variation()
    {
        $variationData = [
            'product_id' => $this->product->id,
            'name' => 'Variação Teste',
            'description' => 'Descrição da variação',
            'sku' => 'SKU-TEST-001',
            'price' => 99.99,
            'compare_price' => 129.99,
            'stock_quantity' => 50,
            'status' => 'active',
            'attributes' => [
                'color' => 'Vermelho',
                'size' => 'M'
            ],
            'variation_options' => [
                'color' => 'Vermelho',
                'size' => 'M'
            ],
        ];

        $response = $this->postJson('/api/v1/products/variations', $variationData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'sku',
                    'price',
                    'formatted_price',
                    'stock_quantity',
                    'status',
                ]
            ]);

        $this->assertDatabaseHas('product_variations', [
            'name' => 'Variação Teste',
            'sku' => 'SKU-TEST-001',
            'price' => 99.99,
        ]);
    }

    /** @test */
    public function it_can_show_a_product_variation()
    {
        $variation = ProductVariation::factory()->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson("/api/v1/products/variations/{$variation->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'sku',
                    'price',
                    'formatted_price',
                    'stock_quantity',
                    'status',
                ]
            ]);
    }

    /** @test */
    public function it_can_update_a_product_variation()
    {
        $variation = ProductVariation::factory()->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $updateData = [
            'name' => 'Variação Atualizada',
            'price' => 149.99,
            'stock_quantity' => 75,
        ];

        $response = $this->putJson("/api/v1/products/variations/{$variation->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'price',
                    'stock_quantity',
                ]
            ]);

        $this->assertDatabaseHas('product_variations', [
            'id' => $variation->id,
            'name' => 'Variação Atualizada',
            'price' => 149.99,
            'stock_quantity' => 75,
        ]);
    }

    /** @test */
    public function it_can_delete_a_product_variation()
    {
        $variation = ProductVariation::factory()->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/v1/products/variations/{$variation->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message'
            ]);

        $this->assertSoftDeleted('product_variations', [
            'id' => $variation->id,
        ]);
    }

    /** @test */
    public function it_can_set_a_variation_as_default()
    {
        $variation = ProductVariation::factory()->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'is_default' => false,
        ]);

        $response = $this->postJson("/api/v1/products/variations/{$variation->id}/set-default");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'is_default',
                ]
            ]);

        $this->assertDatabaseHas('product_variations', [
            'id' => $variation->id,
            'is_default' => true,
        ]);
    }

    /** @test */
    public function it_can_update_stock()
    {
        $variation = ProductVariation::factory()->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'stock_quantity' => 50,
        ]);

        $stockData = [
            'quantity' => 10,
            'operation' => 'increase',
        ];

        $response = $this->postJson("/api/v1/products/variations/{$variation->id}/update-stock", $stockData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'stock_quantity',
                ]
            ]);

        $this->assertDatabaseHas('product_variations', [
            'id' => $variation->id,
            'stock_quantity' => 60,
        ]);
    }

    /** @test */
    public function it_can_get_variations_by_product()
    {
        ProductVariation::factory()->count(2)->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson("/api/v1/products/products/{$this->product->id}/variations");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'sku',
                        'price',
                        'stock_quantity',
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_variation()
    {
        $response = $this->postJson('/api/v1/products/variations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'product_id',
                'name',
                'sku',
                'price',
                'stock_quantity',
            ]);
    }

    /** @test */
    public function it_validates_unique_sku()
    {
        $existingVariation = ProductVariation::factory()->create([
            'product_id' => $this->product->id,
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'sku' => 'SKU-UNIQUE-001',
        ]);

        $variationData = [
            'product_id' => $this->product->id,
            'name' => 'Variação Teste',
            'sku' => 'SKU-UNIQUE-001', // Same SKU
            'price' => 99.99,
            'stock_quantity' => 50,
        ];

        $response = $this->postJson('/api/v1/products/variations', $variationData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sku']);
    }
}