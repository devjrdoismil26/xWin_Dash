<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains\Projects\Domain\Project;
use Faker\Generator as Faker;

class TagSeeder extends Seeder
{
    public function run(Faker $faker): void
    {
        $projects = Project::all();
        foreach ($projects as $project) {
            for ($i = 0; $i < 5; $i++) {
                $name = $faker->word();
                // Garante que o nome da tag seja único para o projeto atual
                while (Tag::where('project_id', $project->id)->where('name', $name)->exists()) {
                    $name = $faker->word();
                }

                Tag::factory()->create([
                    'project_id' => $project->id,
                    'name' => $name,
                ]);
            }
        }
    }
} 
