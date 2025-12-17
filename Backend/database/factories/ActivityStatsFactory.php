<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ActivityStatsFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['users', 'auth', 'products', 'orders', 'payments', 'media', 'projects', 'system'];

        return [
            'id' => Str::uuid(),
            'category' => $this->faker->randomElement($categories),
            'action' => $this->faker->randomElement(['created', 'updated', 'deleted', 'viewed']),
            'count' => $this->faker->numberBetween(1, 1000),
            'date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'metadata' => json_encode([
                'avg_duration' => $this->faker->numberBetween(100, 5000),
                'success_rate' => $this->faker->randomFloat(2, 80, 100),
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
