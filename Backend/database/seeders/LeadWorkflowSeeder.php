<?php

namespace Database\Seeders;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;

class LeadWorkflowSeeder extends Seeder
{
    public function run(): void
    {
        $leads = Lead::all();
        $workflows = Workflow::all();

        foreach ($leads as $lead) {
            foreach ($workflows->random(rand(1, 3)) as $workflow) {
                LeadWorkflow::factory()->create([
                    'lead_id' => $lead->id,
                    'workflow_id' => $workflow->id,
                ]);
            }
        }

        $this->command->info('Lead Workflows seeded!');
    }
} 
