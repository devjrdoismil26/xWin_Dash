<?php

namespace Database\Factories\Leads;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadWorkflowFactory extends Factory
{
    protected $model = LeadWorkflow::class;

    public function definition(): array
    {
        return [
            'lead_id' => Lead::factory(),
            'workflow_id' => Workflow::factory(),
            'status' => $this->faker->randomElement(['pending', 'running', 'completed', 'failed']),
            'current_step' => $this->faker->word(),
        ];
    }

    public function completed(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    public function failed(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
        ]);
    }
}
