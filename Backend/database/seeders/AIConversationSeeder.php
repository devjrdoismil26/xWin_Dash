<?php

namespace Database\Seeders;

use App\Domains\AI\Domain\AIConversation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AIConversationSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for AIConversation.
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
                AIConversation::truncate();
            }

            $this->command->info('Seeding AIConversation...');

            // Criar conversas de exemplo
            $projects = \App\Domains\Projects\Domain\Project::take(3)->get();
            $users = \App\Domains\Users\Domain\User::take(5)->get();

            foreach ($projects as $project) {
                foreach ($users->take(2) as $user) {
                    AIConversation::factory()
                        ->count(5)
                        ->create([
                            'project_id' => $project->id,
                            'user_id' => $user->id,
                        ]);
                }
            }

            $this->command->info('AIConversation seeded successfully!');
        }
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
    }
}
