<?php

namespace Database\Factories;

use App\Models\ApiCredential;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ApiCredentialFactory extends Factory
{
    protected $model = ApiCredential::class;

    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'user_id' => \App\Models\User::factory(),
            'service' => $this->faker->randomElement(['stripe', 'paypal', 'mercadopago', 'aws', 'google', 'facebook']),
            'name' => $this->faker->words(2, true),
            'credentials' => encrypt(json_encode([
                'api_key' => Str::random(32),
                'secret' => Str::random(64),
                'environment' => $this->faker->randomElement(['sandbox', 'production']),
            ])),
            'is_active' => $this->faker->boolean(80),
            'expires_at' => $this->faker->optional(0.3)->dateTimeBetween('now', '+1 year'),
            'last_used_at' => $this->faker->optional(0.7)->dateTimeBetween('-30 days', 'now'),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $this->faker->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }
}
