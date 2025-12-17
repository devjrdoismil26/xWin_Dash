<?php

namespace Database\Seeders;

use App\Domains$1\Domain$2;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuraConnectionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for AuraConnection.
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
                        AuraConnection::truncate();
                    }

        $this->command->info('Seeding AuraConnection...');

        // Criar conexões WhatsApp para projetos
        $projects = \App\Domains\Projects\Domain\Project::take(3)->get();
        $users = \App\Domains\Users\Domain\User::take(5)->get();

        foreach ($projects as $project) {
            $user = $users->random();

            // Conexão principal ativa
            AuraConnection::factory()->create([
                'name' => 'WhatsApp Principal - ' . $project->name,
                'phone_number' => '+55 11 9' . rand(1000, 9999) . '-' . rand(1000, 9999),
                'status' => 'connected',
                'project_id' => $project->id,
                'user_id' => $user->id,
                'settings' => [
                    'auto_reply' => true,
                    'business_hours' => '9-17',
                    'max_messages_per_day' => 500,
                ],
            ]);

            // Conexão de backup (pode estar desconectada)
            AuraConnection::factory()->create([
                'name' => 'WhatsApp Backup - ' . $project->name,
                'phone_number' => '+55 11 9' . rand(1000, 9999) . '-' . rand(1000, 9999),
                'status' => rand(0, 1) ? 'connected' : 'disconnected',
                'project_id' => $project->id,
                'user_id' => $user->id,
                'settings' => [
                    'auto_reply' => false,
                    'business_hours' => '24/7',
                    'max_messages_per_day' => 200,
                ],
            ]);
        }

        $this->command->info('AuraConnection seeded successfully!');
    
}
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
}
}
