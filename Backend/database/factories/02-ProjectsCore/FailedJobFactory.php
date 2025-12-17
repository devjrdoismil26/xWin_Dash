<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FailedJobFactory extends Factory
{
    protected $model = FailedJob::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid(),
            'connection' => $this->faker->word(),
            'queue' => $this->faker->word(),
            'payload' => json_encode(['data' => $this->faker->sentence()]),
            'exception' => $this->faker->paragraph(),
            'failed_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
