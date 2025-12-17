<?php

namespace Database\Seeders;

use App\Domains$1\Domain$2;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApiCredentialSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for ApiCredential.
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
                        ApiCredential::truncate();
                    }

        $this->command->info('Seeding ApiCredential...');

        // Criar credenciais de API para projetos
        $projects = \App\Domains\Projects\Domain\Project::take(3)->get();
        $users = \App\Domains\Users\Domain\User::take(5)->get();

        $providers = [
            'instagram' => 'Instagram Business API',
            'facebook' => 'Facebook Graph API',
            'twitter' => 'Twitter API v2',
            'linkedin' => 'LinkedIn Marketing API',
            'google' => 'Google Ads API',
            'mailgun' => 'Mailgun Email API',
        ];

        foreach ($projects as $project) {
            $user = $users->random();

            foreach ($providers as $provider => $name) {
                // Algumas credenciais ativas, outras expiradas
                $isActive = rand(0, 100) > 20; // 80% chance de estar ativa

                if ($provider === 'instagram') {
                    ApiCredential::factory()
                        ->instagram()
                        ->create([
                            'name' => $name,
                            'project_id' => $project->id,
                            'user_id' => $user->id,
                            'is_active' => $isActive,
                        ]);
                } else {
                    $factory = ApiCredential::factory();
                    
                    if (!$isActive) {
                        $factory = $factory->expired();
                    }

                    $factory->create([
                        'name' => $name,
                        'provider' => $provider,
                        'project_id' => $project->id,
                        'user_id' => $user->id,
                        'is_active' => $isActive,
                    ]);
                }
            }
        }

        $this->command->info('ApiCredential seeded successfully!');
    
}
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
}
}
