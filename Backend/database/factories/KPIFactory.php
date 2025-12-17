<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class KPIFactory extends Factory
{
    public function definition(): array
    {
        $periods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

        return [
            'id' => Str::uuid(),
            'name' => $this->faker->words(3, true) . ' Target',
            'metric_key' => $this->faker->slug(2) . '.' . $this->faker->word,
            'target_value' => $this->faker->randomFloat(2, 100, 100000),
            'current_value' => $this->faker->randomFloat(2, 50, 90000),
            'period' => $this->faker->randomElement($periods),
            'is_active' => $this->faker->boolean(90),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
