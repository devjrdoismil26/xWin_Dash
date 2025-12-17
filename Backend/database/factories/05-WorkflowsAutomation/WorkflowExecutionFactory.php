<?php

namespace Database\Factories\Workflows;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowExecutionFactory extends Factory
{
    protected $model = WorkflowExecution::class;

    public function definition(): array
    {
        return [
            'workflow_id' => Workflow::factory(),
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'lead_id' => $this->faker->boolean(50) ? Lead::factory() : null,
            'status' => $this->faker->randomElement(['pending', 'running', 'completed', 'failed', 'cancelled']),
            'input_data' => [],
            'output_data' => [],
            'execution_log' => [],
            'started_at' => $this->faker->dateTimeThisYear(),
            'completed_at' => $this->faker->boolean(70) ? $this->faker->dateTimeThisYear() : null,
            'error_message' => $this->faker->boolean(20) ? $this->faker->sentence() : null,
            'retry_count' => $this->faker->numberBetween(0, 3),
            'max_retries' => 3,
        ];
    }

    public function completed(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function failed(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'error_message' => $this->faker->sentence(),
        ]);
    }
}
