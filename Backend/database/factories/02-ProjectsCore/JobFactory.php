<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        return [
            'queue' => $this->faker->word(),
            'payload' => json_encode(['data' => $this->faker->sentence()]),
            'attempts' => $this->faker->numberBetween(0, 5),
            'reserved_at' => $this->faker->boolean(50) ? $this->faker->unixTime() : null,
            'available_at' => $this->faker->unixTime(),
            'created_at' => $this->faker->unixTime(),
        ];
    }
}
