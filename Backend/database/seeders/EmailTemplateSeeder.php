<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains\Projects\Domain\Project;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();
        foreach ($projects as $project) {
            EmailTemplate::factory(3)->create(['project_id' => $project->id]);
        }
    }
} 
