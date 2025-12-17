<?php

namespace Database\Factories;

use App\Domains\Core\Infrastructure\Persistence\Eloquent\CacheEntryModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Core\Infrastructure\Persistence\Eloquent\CacheEntryModel>
 */
class CacheEntryModelFactory extends Factory
{
    protected $model = CacheEntryModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'key' => $this->faker->unique()->slug(2),
            'value' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['string', 'array', 'object', 'number', 'boolean']),
            'ttl' => $this->faker->numberBetween(300, 86400), // 5 minutes to 24 hours
            'description' => $this->faker->optional()->sentence(),
            'expires_at' => $this->faker->dateTimeBetween('now', '+1 year'),
        ];
    }
}