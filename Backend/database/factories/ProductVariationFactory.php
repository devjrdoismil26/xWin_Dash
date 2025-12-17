<?php

namespace Database\Factories;

use App\Domains\Products\Models\ProductVariation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Products\Models\ProductVariation>
 */
class ProductVariationFactory extends Factory
{
    protected $model = ProductVariation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = ['Vermelho', 'Azul', 'Verde', 'Preto', 'Branco', 'Amarelo', 'Rosa', 'Roxo'];
        $sizes = ['P', 'M', 'G', 'GG', 'XG'];
        $materials = ['Algodão', 'Poliester', 'Linho', 'Seda', 'Jeans'];

        return [
            'product_id' => \App\Domains\Products\Models\Product::factory(),
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'sku' => 'SKU-' . $this->faker->unique()->numerify('####'),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'compare_price' => $this->faker->optional(0.3)->randomFloat(2, 50, 600),
            'cost_price' => $this->faker->randomFloat(2, 5, 200),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'track_inventory' => $this->faker->boolean(80),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'weight' => $this->faker->randomFloat(2, 0.1, 5.0),
            'dimensions' => [
                'width' => $this->faker->randomFloat(2, 10, 50),
                'height' => $this->faker->randomFloat(2, 10, 50),
                'depth' => $this->faker->randomFloat(2, 1, 20),
            ],
            'images' => [
                $this->faker->imageUrl(800, 600, 'products'),
                $this->faker->imageUrl(800, 600, 'products'),
            ],
            'attributes' => [
                'color' => $this->faker->randomElement($colors),
                'size' => $this->faker->randomElement($sizes),
                'material' => $this->faker->randomElement($materials),
            ],
            'variation_options' => [
                'color' => $this->faker->randomElement($colors),
                'size' => $this->faker->randomElement($sizes),
            ],
            'is_default' => false,
            'sort_order' => $this->faker->numberBetween(0, 100),
            'project_id' => \App\Domains\Core\Models\Project::factory(),
            'created_by' => \App\Domains\Core\Models\User::factory(),
        ];
    }

    /**
     * Indicate that the variation is the default one.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }

    /**
     * Indicate that the variation is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
            'track_inventory' => true,
        ]);
    }

    /**
     * Indicate that the variation has unlimited stock.
     */
    public function unlimitedStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'track_inventory' => false,
        ]);
    }

    /**
     * Indicate that the variation is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
