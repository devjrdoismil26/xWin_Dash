<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MetricFactory extends Factory
{
    public function definition(): array
    {
        $types = ['number', 'currency', 'percentage', 'duration'];
        $aggregations = ['sum', 'avg', 'count', 'min', 'max', 'calculated'];

        return [
            'id' => Str::uuid(),
            'name' => $this->faker->words(3, true),
            'key' => $this->faker->slug(2) . '.' . $this->faker->word,
            'type' => $this->faker->randomElement($types),
            'aggregation' => $this->faker->randomElement($aggregations),
            'is_active' => $this->faker->boolean(90),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
