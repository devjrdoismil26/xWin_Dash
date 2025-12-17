<?php

namespace Database\Factories\Workflows;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowVersionFactory extends Factory
{
    protected $model = WorkflowVersion::class;

    public function definition(): array
    {
        return [
            'workflow_id' => Workflow::factory(),
            'definition' => [],
            'version_name' => $this->faker->sentence(2),
            'description' => $this->faker->paragraph(),
            'user_id' => User::factory(),
        ];
    }
}
