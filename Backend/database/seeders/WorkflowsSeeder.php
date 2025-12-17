<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Workflows\Domain\Workflow;

class WorkflowsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Criar workflows
        $workflows = Workflow::factory()->count(5)->create();

        // Para cada workflow, criar nós e logs
        $workflows->each(function ($workflow) {
            WorkflowNode::factory()->count(rand(3, 10))->create(['workflow_id' => $workflow->id]);
            WorkflowLog::factory()->count(rand(10, 50))->create(['workflow_id' => $workflow->id]);

            WorkflowVersion::factory()->count(rand(1, 5))->create(['workflow_id' => $workflow->id]);
        });

        $this->command->info('Workflows seeded!');
    }
}
