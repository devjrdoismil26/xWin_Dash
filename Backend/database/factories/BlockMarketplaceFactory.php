<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\BlockMarketplace>
 */
class BlockMarketplaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'category' => $this->faker->randomElement(['Analytics', 'AI', 'Security', 'Integration', 'Innovation', 'Marketing', 'Productivity', 'Communication']),
            'author' => $this->faker->name(),
            'version' => $this->faker->semver(),
            'price' => $this->faker->randomFloat(2, 0, 999.99),
            'rating' => $this->faker->randomFloat(1, 1, 5),
            'downloads' => $this->faker->numberBetween(0, 100000),
            'tags' => $this->faker->words(5),
            'preview' => $this->faker->imageUrl(),
            'features' => $this->faker->words(8),
            'compatibility' => $this->faker->words(3),
            'is_premium' => $this->faker->boolean(30),
            'is_featured' => $this->faker->boolean(10),
            'is_new' => $this->faker->boolean(20),
            'is_active' => true,
            'author_id' => \App\Models\User::factory(),
        ];
    }
}
