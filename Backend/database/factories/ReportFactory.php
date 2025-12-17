<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ReportFactory extends Factory
{
    public function definition(): array
    {
        $types = ['sales', 'users', 'traffic', 'products', 'orders'];

        return [
            'id' => Str::uuid(),
            'name' => $this->faker->words(3, true) . ' Report',
            'type' => $this->faker->randomElement($types),
            'config' => json_encode([
                'metrics' => $this->faker->randomElements(['revenue.total', 'orders.total', 'users.active'], 3),
                'period' => $this->faker->randomElement(['daily', 'weekly', 'monthly']),
                'format' => $this->faker->randomElement(['table', 'chart', 'summary']),
            ]),
            'is_active' => $this->faker->boolean(85),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
