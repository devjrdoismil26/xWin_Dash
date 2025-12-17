<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Support\Str;

class ProjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Buscar o primeiro usuário para ser o owner
        $user = UserModel::first();
        
        if (!$user) {
            $this->command->error('Nenhum usuário encontrado. Execute o UserSeeder primeiro.');
            return;
        }

        // Projetos Universe
        $universeProjects = [
            [
                'name' => 'E-commerce Revolution',
                'description' => 'Plataforma de e-commerce com IA integrada para personalização de experiência do usuário',
                'type' => 'universe',
                'status' => 'active',
                'priority' => 'high',
                'progress' => 67,
                'blocks' => ['leads', 'email-marketing', 'social-buffer', 'analytics', 'ai'],
                'ai_level' => 'balanced',
                'universe_config' => [
                    'auto_optimization' => true,
                    'ai_suggestions' => true,
                    'real_time_sync' => true
                ]
            ],
            [
                'name' => 'Marketing Automation Hub',
                'description' => 'Central de automação de marketing com blocos inteligentes conectados',
                'type' => 'universe',
                'status' => 'active',
                'priority' => 'medium',
                'progress' => 89,
                'blocks' => ['aura', 'email-marketing', 'workflows', 'analytics'],
                'ai_level' => 'aggressive',
                'universe_config' => [
                    'auto_optimization' => true,
                    'ai_suggestions' => true,
                    'real_time_sync' => true
                ]
            ],
            [
                'name' => 'AI Content Generator',
                'description' => 'Sistema automatizado de geração de conteúdo com múltiplos blocos de IA',
                'type' => 'universe',
                'status' => 'active',
                'priority' => 'high',
                'progress' => 45,
                'blocks' => ['ai', 'media', 'social-buffer', 'workflows'],
                'ai_level' => 'aggressive',
                'universe_config' => [
                    'auto_optimization' => true,
                    'ai_suggestions' => true,
                    'real_time_sync' => true
                ]
            ]
        ];

        // Projetos Manuais
        $manualProjects = [
            [
                'name' => 'CRM Tradicional',
                'description' => 'Sistema de gestão de relacionamento com clientes configurado manualmente',
                'type' => 'manual',
                'status' => 'completed',
                'priority' => 'low',
                'progress' => 100,
                'ai_level' => 'conservative'
            ],
            [
                'name' => 'Website Corporativo',
                'description' => 'Desenvolvimento do novo site institucional da empresa',
                'type' => 'manual',
                'status' => 'planning',
                'priority' => 'medium',
                'progress' => 25,
                'ai_level' => 'conservative'
            ]
        ];

        // Criar projetos Universe
        foreach ($universeProjects as $projectData) {
            ProjectModel::create(array_merge($projectData, [
                'slug' => Str::slug($projectData['name']) . '-' . Str::random(6),
                'owner_id' => $user->id,
                'is_active' => true,
                'timezone' => 'America/Sao_Paulo',
                'currency' => 'BRL'
            ]));
        }

        // Criar projetos manuais
        foreach ($manualProjects as $projectData) {
            ProjectModel::create(array_merge($projectData, [
                'slug' => Str::slug($projectData['name']) . '-' . Str::random(6),
                'owner_id' => $user->id,
                'is_active' => true,
                'timezone' => 'America/Sao_Paulo',
                'currency' => 'BRL'
            ]));
        }

        $this->command->info('Projects seeded successfully!');
    }
}
