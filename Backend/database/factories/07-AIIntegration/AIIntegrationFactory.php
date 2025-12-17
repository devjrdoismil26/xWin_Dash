<?php

namespace Database\Factories\AI;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AIIntegrationFactory extends Factory
{
    protected $model = AIIntegration::class;

    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['openai', 'gemini', 'claude']),
            'api_key' => Str::random(40),
            'status' => $this->faker->randomElement(['active', 'inactive', 'error']),
            'user_id' => $this->faker->boolean(80) ? User::factory() : null,
        ];
    }

    public function inactive(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    public function error(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'error',
        ]);
    }
}
