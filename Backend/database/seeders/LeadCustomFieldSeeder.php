<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Leads\Domain\LeadCustomField;
use App\Domains\Projects\Domain\Project;

class LeadCustomFieldSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();
        foreach ($projects as $project) {
            LeadCustomField::factory(3)->create(['project_id' => $project->id]);
        }
    }
}
