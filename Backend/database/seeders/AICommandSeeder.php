<?php

namespace Database\Seeders;

use App\Domains\AI\Domain\AICommand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AICommandSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for AICommand.
     */
    public function run(): void
    {
        // SQLite compatible foreign key handling
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        }
        {
            // Limpar dados existentes em ambiente de desenvolvimento
            if (app()->environment(['local', 'testing'])) {
                AICommand::truncate();
            }

            $this->command->info('Seeding AICommand...');

            // Criar comandos de exemplo para diferentes projetos
            $projects = \App\Domains\Projects\Domain\Project::take(3)->get();
            $users = \App\Domains\Users\Domain\User::take(5)->get();

            foreach ($projects as $project) {
                foreach ($users->take(2) as $user) {
                    // Comandos completed
                    AICommand::factory()
                        ->count(10)
                        ->completed()
                        ->create([
                            'project_id' => $project->id,
                            'user_id' => $user->id,
                        ]);

                    // Comandos pending
                    AICommand::factory()
                        ->count(3)
                        ->pending()
                        ->create([
                            'project_id' => $project->id,
                            'user_id' => $user->id,
                        ]);

                    // Alguns comandos failed
                    AICommand::factory()
                        ->count(2)
                        ->failed()
                        ->create([
                            'project_id' => $project->id,
                            'user_id' => $user->id,
                        ]);
                }
            }

            $this->command->info('AICommand seeded successfully!');
        }
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
    }
}
