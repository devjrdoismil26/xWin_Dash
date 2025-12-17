<?php

namespace Database\Factories\Users;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModelHasRoleFactory extends Factory
{
    protected $model = ModelHasRole::class;

    public function definition(): array
    {
        return [
            'role_id' => Role::factory(),
            'model_id' => User::factory(),
            'model_type' => User::class,
        ];
    }
}
