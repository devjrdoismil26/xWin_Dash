<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Leads\Domain\Lead;
use App\Domains\Projects\Domain\Project;
use App\Domains\Projects\Domain\Project;

class LeadsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Pega o primeiro projeto ou cria um novo se não existir
        $project = Project::first() ?? Project::factory()->create();

        // Criar campos customizados para este projeto
        $customFields = LeadCustomField::factory()->count(5)->create([
            'project_id' => $project->id,
        ]);

        // Criar leads para este projeto
        $leads = Lead::factory()->count(50)->create([
            'project_id' => $project->id,
        ]);

        // Para cada lead, criar valores customizados, emails e histórico
        $leads->each(function ($lead) use ($customFields) {
            // Criar valores customizados para o lead
            $customFields->each(function ($field) use ($lead) {
                LeadCustomValue::factory()
                    ->for($lead)
                    ->for($field, 'customField')
                    ->create();
            });

            // Criar emails para o lead
            LeadEmail::factory()->count(rand(1, 5))->create(['lead_id' => $lead->id]);

            // Criar histórico para o lead
            LeadHistory::factory()->count(rand(1, 10))->create(['lead_id' => $lead->id]);
        });

        $this->command->info('Leads seeded!');
    }
}
