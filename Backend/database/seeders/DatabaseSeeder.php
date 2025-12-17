<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Verificar se é ambiente de desenvolvimento
        if (app()->environment('local')) {
            $this->call([
                DevelopmentSeeder::class,
            ]);
        } else {
            $this->call([
                // Core & Auth
                UsersSeeder::class,
                RoleSeeder::class,
                PermissionSeeder::class,
                CoreSeeder::class,

                // System
                SettingsSeeder::class,
                CategorizationSeeder::class,
                IntegrationsSeeder::class,

                // Modules
                DashboardSeeder::class,
                AnalyticsSeeder::class,
                ActivitySeeder::class,
                ProductsSeeder::class,
                ProjectsSeeder::class,
                LeadsSeeder::class,
                EmailMarketingSeeder::class,
                SocialBufferSeeder::class,
                WorkflowsSeeder::class,
                AuraSeeder::class,
                AISeeder::class,
                MediaSeeder::class,
            ]);
        }

        $this->command->info('✅ Database seeded successfully!');
    }
}

