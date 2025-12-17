<?php

namespace Database\Factories;

use App\Models\LeadScoreHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadScoreHistoryFactory extends Factory
{
    protected $model = LeadScoreHistory::class;

    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            // TODO: Add specific fields based on migration
            // Common fields that might exist:
            // 'name' => $this->faker->words(2, true),
            // 'description' => $this->faker->optional(0.7)->sentence(),
            // 'is_active' => $this->faker->boolean(85),
            // 'project_id' => \App\Models\Project::factory(),
            // 'created_by' => \App\Models\User::factory(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
