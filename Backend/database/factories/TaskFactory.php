<?php

namespace Database\Factories;

use App\Domains\Projects\Models\Task;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['todo', 'in_progress', 'review', 'done', 'cancelled']),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'type' => fake()->randomElement(['task', 'bug', 'feature', 'improvement']),
            'due_date' => fake()->optional()->dateTimeBetween('now', '+60 days'),
            'completed_at' => null,
            'project_id' => Project::factory(),
            'assigned_to' => User::factory(),
            'created_by' => User::factory(),
            'estimated_hours' => fake()->optional()->numberBetween(1, 40),
            'actual_hours' => null,
            'is_archived' => false,
            'tags' => fake()->optional()->randomElements(['frontend', 'backend', 'design', 'urgent'], 2),
        ];
    }

    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'urgent',
            'due_date' => fake()->dateTimeBetween('now', '+7 days'),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'done',
            'completed_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'actual_hours' => fake()->numberBetween(1, 20),
        ]);
    }
}
