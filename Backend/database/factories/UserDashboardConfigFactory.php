<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserDashboardConfigFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'user_id' => Str::uuid(),
            'layout_id' => Str::uuid(),
            'visible_widgets' => json_encode($this->faker->randomElements([1,2,3,4,5,6,7,8,9,10], $this->faker->numberBetween(4, 8))),
            'preferences' => json_encode([
                'theme' => $this->faker->randomElement(['light', 'dark']),
                'refresh_interval' => $this->faker->randomElement([30, 60, 300]),
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
