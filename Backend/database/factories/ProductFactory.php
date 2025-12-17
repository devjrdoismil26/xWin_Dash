<?php

namespace Database\Factories;

use App\Domains\Products\Models\Product;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->words(3, true);
        
        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name) . '-' . Str::random(6),
            'description' => fake()->paragraph(),
            'short_description' => fake()->sentence(),
            'sku' => strtoupper(fake()->bothify('PRD-####??')),
            'price' => fake()->randomFloat(2, 10, 1000),
            'cost' => fake()->randomFloat(2, 5, 500),
            'stock' => fake()->numberBetween(0, 100),
            'status' => fake()->randomElement(['draft', 'active', 'inactive', 'archived']),
            'type' => fake()->randomElement(['physical', 'digital', 'service']),
            'images' => [fake()->imageUrl(800, 800, 'products')],
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'metadata' => [
                'weight' => fake()->randomFloat(2, 0.1, 10),
                'dimensions' => [
                    'length' => fake()->numberBetween(10, 100),
                    'width' => fake()->numberBetween(10, 100),
                    'height' => fake()->numberBetween(10, 100),
                ],
            ],
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'stock' => fake()->numberBetween(10, 100),
        ]);
    }

    public function digital(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'digital',
            'stock' => null,
        ]);
    }
}
