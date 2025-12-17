<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DashboardLayoutFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'name' => $this->faker->words(2, true),
            'config' => json_encode([
                'grid' => $this->faker->randomElement(['2x2', '3x3', '4x2', '2x4']),
                'widgets' => $this->faker->randomElements([1,2,3,4,5,6,7,8], $this->faker->numberBetween(3, 6)),
            ]),
            'is_default' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
