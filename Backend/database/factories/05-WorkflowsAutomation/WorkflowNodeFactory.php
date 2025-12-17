<?php

namespace Database\Factories\Workflows;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowNodeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = WorkflowNode::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'workflow_id' => Workflow::factory(),
            'type' => $this->faker->randomElement(['start', 'email', 'condition', 'action', 'end']),
            'config' => [],
            'connections' => [],
        ];
    }
}
