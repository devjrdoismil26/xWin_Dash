<?php

namespace Database\Factories\ADStool;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'platform' => $this->faker->randomElement(['google', 'facebook']),
            'account_id' => Str::uuid(),
            'account_name' => $this->faker->company(),
            'access_token' => Str::random(60),
            'refresh_token' => $this->faker->boolean(50) ? Str::random(60) : null,
            'token_expires_at' => $this->faker->boolean(80) ? $this->faker->dateTimeBetween('+1 day', '+1 year') : null,
            'account_settings' => [],
            'is_active' => $this->faker->boolean(90),
            'last_sync_at' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    public function inactive(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
