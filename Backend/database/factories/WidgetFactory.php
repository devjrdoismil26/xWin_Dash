<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WidgetFactory extends Factory
{
    public function definition(): array
    {
        $types = ['stat', 'chart', 'table', 'list', 'feed', 'actions'];
        $type = $this->faker->randomElement($types);

        return [
            'id' => Str::uuid(),
            'name' => $this->faker->words(3, true),
            'type' => $type,
            'config' => json_encode([
                'metric' => $this->faker->word,
                'icon' => $this->faker->word,
                'color' => $this->faker->hexColor,
            ]),
            'is_active' => $this->faker->boolean(90),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
