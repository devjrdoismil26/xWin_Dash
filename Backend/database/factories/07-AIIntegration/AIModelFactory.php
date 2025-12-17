<?php

namespace Database\Factories\AI;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AIModelFactory extends Factory
{
    protected $model = AIModel::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word() . ' Model',
            'provider' => $this->faker->randomElement(['Google', 'OpenAI', 'Anthropic']),
            'api_endpoint' => $this->faker->url(),
            'api_key_setting_key' => $this->faker->slug(),
            'is_default' => $this->faker->boolean(20),
        ];
    }

    public function default(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
