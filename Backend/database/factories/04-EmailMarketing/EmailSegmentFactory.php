<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailSegmentFactory extends Factory
{
    protected $model = EmailSegment::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(2, true) . ' Segment',
            'description' => $this->faker->paragraph(),
            'rules' => json_encode([]),
            'is_active' => $this->faker->boolean(90),
        ];
    }

    public function inactive(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
