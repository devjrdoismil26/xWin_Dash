<?php

namespace Database\Factories;

use App\Domains\Workflows\Models\Workflow;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowFactory extends Factory
{
    protected $model = Workflow::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'trigger_type' => fake()->randomElement(['manual', 'schedule', 'webhook', 'event']),
            'trigger_config' => [
                'event' => 'lead.created',
                'conditions' => [],
            ],
            'status' => fake()->randomElement(['draft', 'active', 'paused', 'archived']),
            'is_active' => true,
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'execution_count' => fake()->numberBetween(0, 1000),
            'last_executed_at' => fake()->optional()->dateTimeBetween('-30 days', 'now'),
            'settings' => [
                'max_executions' => null,
                'timeout' => 300,
            ],
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'is_active' => true,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'trigger_type' => 'schedule',
            'trigger_config' => [
                'schedule' => '0 9 * * *', // Daily at 9am
            ],
        ]);
    }
}
