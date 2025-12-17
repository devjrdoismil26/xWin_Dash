<?php

namespace Database\Factories\Workflows;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowLogFactory extends Factory
{
    protected $model = WorkflowLog::class;

    public function definition(): array
    {
        return [
            'workflow_id' => 1,
            'node_id' => 1,
            'status' => 'running',
            'input_data' => [],
            'output_data' => [],
            'error_message' => null,
            'project_id' => null,
            'user_id' => null,
            'started_at' => now(),
            'completed_at' => now(),
        ];
    }
} 
