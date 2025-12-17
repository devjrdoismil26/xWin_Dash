<?php

namespace Database\Factories\Users;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoginAttemptFactory extends Factory
{
    protected $model = LoginAttempt::class;

    public function definition(): array
    {
        return [
            'user_id' => $this->faker->boolean(80) ? User::factory() : null,
            'ip_address' => $this->faker->ipv4(),
            'successful' => $this->faker->boolean(70),
        ];
    }

    public function successful(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'successful' => true,
        ]);
    }

    public function failed(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'successful' => false,
        ]);
    }
}
