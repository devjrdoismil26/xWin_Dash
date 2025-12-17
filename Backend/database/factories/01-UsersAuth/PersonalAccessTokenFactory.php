<?php

namespace Database\Factories\Users;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PersonalAccessTokenFactory extends Factory
{
    protected $model = PersonalAccessToken::class;

    public function definition(): array
    {
        return [
            'tokenable_type' => User::class,
            'tokenable_id' => User::factory(),
            'name' => $this->faker->word() . ' Token',
            'token' => hash('sha256', Str::random(40)),
            'abilities' => ['*'],
            'last_used_at' => $this->faker->boolean(70) ? $this->faker->dateTimeThisYear() : null,
            'expires_at' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('+1 day', '+1 year') : null,
        ];
    }

    public function expired(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $this->faker->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }
}
