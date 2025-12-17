<?php

namespace Database\Factories\Users;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PasswordResetTokenFactory extends Factory
{
    protected $model = PasswordResetToken::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'token' => Str::random(60),
            'created_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
