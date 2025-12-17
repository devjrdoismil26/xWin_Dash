<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Module;
use App\Models\Setting;
use App\Models\Integration;
use App\Models\Folder;
use App\Models\CustomField;

class ProjectsCoreSeeder extends Seeder
{
    /**
     * 🏗️ SEEDER MESTRE: PROJECTS & CORE.
     *
     * Seeder principal para o domínio de projetos e funcionalidades centrais
     * Inclui: projects, modules, settings, integrations, etc.
     */
    public function run(): void
    {
        $this->command->info('🏗️ Iniciando seeding de Projects & Core...');

        // 1. Criar módulos do sistema
        $this->createModules();

        // 2. Criar configurações globais
        $this->createSettings();

        // 3. Criar projetos de exemplo
        $this->createProjects();

        // 4. Criar integrações disponíveis
        $this->createIntegrations();

        // 5. Criar estrutura de pastas
        $this->createFolders();

        // 6. Criar campos customizados
        $this->createCustomFields();

        $this->command->info('✅ Projects & Core seeding concluído!');
    }

    private function createModules(): void
    {
        $this->command->info('   🧩 Criando módulos do sistema...');

        $modules = [
            [
                'name' => 'Leads Management',
                'slug' => 'leads',
                'description' => 'Gestão completa de leads e prospects',
                'icon' => 'users',
                'is_active' => true,
                'is_core' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Email Marketing',
                'slug' => 'email-marketing',
                'description' => 'Campanhas e automação de email',
                'icon' => 'mail',
                'is_active' => true,
                'is_core' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Social Buffer',
                'slug' => 'social-buffer',
                'description' => 'Gestão de redes sociais',
                'icon' => 'share-2',
                'is_active' => true,
                'is_core' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Analytics',
                'slug' => 'analytics',
                'description' => 'Analytics e relatórios avançados',
                'icon' => 'bar-chart',
                'is_active' => true,
                'is_core' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Ads Tool',
                'slug' => 'ads-tool',
                'description' => 'Gestão de campanhas publicitárias',
                'icon' => 'target',
                'is_active' => true,
                'is_core' => false,
                'sort_order' => 5,
            ],
            [
                'name' => 'AI Integration',
                'slug' => 'ai-integration',
                'description' => 'Integração com IA e automação',
                'icon' => 'cpu',
                'is_active' => true,
                'is_core' => false,
                'sort_order' => 6,
            ],
            [
                'name' => 'Aura WhatsApp',
                'slug' => 'aura-whatsapp',
                'description' => 'Integração com WhatsApp',
                'icon' => 'message-circle',
                'is_active' => true,
                'is_core' => false,
                'sort_order' => 7,
            ],
            [
                'name' => 'CRM',
                'slug' => 'crm',
                'description' => 'Customer Relationship Management',
                'icon' => 'heart-handshake',
                'is_active' => true,
                'is_core' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($modules as $moduleData) {
            Module::firstOrCreate([
                'slug' => $moduleData['slug'],
            ], $moduleData);
        }
    }

    private function createSettings(): void
    {
        $this->command->info('   ⚙️ Criando configurações globais...');

        $settings = [
            // Gerais
            'app.name' => 'xWin Dash',
            'app.description' => 'Plataforma completa de marketing digital e CRM',
            'app.timezone' => 'America/Sao_Paulo',
            'app.language' => 'pt-BR',

            // Email
            'email.from_name' => 'xWin Dash',
            'email.from_email' => 'noreply@xwindash.com',
            'email.daily_limit' => '10000',

            // Sistema
            'system.maintenance_mode' => 'false',
            'system.registration_enabled' => 'true',
            'system.debug_mode' => 'false',

            // Analytics
            'analytics.enabled' => 'true',
            'analytics.retention_days' => '365',

            // Uploads
            'uploads.max_file_size' => '10485760', // 10MB
            'uploads.allowed_types' => 'jpg,jpeg,png,pdf,doc,docx',
        ];

        foreach ($settings as $key => $value) {
            Setting::firstOrCreate([
                'key' => $key,
            ], [
                'value' => $value,
                'type' => is_numeric($value) ? 'integer' : (in_array($value, ['true', 'false']) ? 'boolean' : 'string'),
                'is_public' => in_array($key, ['app.name', 'app.timezone', 'app.language']),
            ]);
        }
    }

    private function createProjects(): void
    {
        $this->command->info('   📁 Criando projetos de exemplo...');

        // Projeto demonstração
        $demoProject = Project::firstOrCreate([
            'name' => 'Projeto Demonstração',
        ], [
            'description' => 'Projeto de demonstração do xWin Dash',
            'status' => 'active',
            'settings' => [
                'timezone' => 'America/Sao_Paulo',
                'currency' => 'BRL',
                'language' => 'pt-BR',
            ],
        ]);

        // Habilitar todos os módulos para o projeto demo
        $modules = Module::where('is_active', true)->get();
        foreach ($modules as $module) {
            $demoProject->modules()->syncWithoutDetaching([$module->id => [
                'is_enabled' => true,
                'settings' => [],
            ]]);
        }

        // Criar mais 3 projetos de exemplo
        Project::factory(3)->create()->each(function ($project) use ($modules) {
            // Habilitar alguns módulos aleatórios
            $enabledModules = $modules->random(rand(3, 6));
            foreach ($enabledModules as $module) {
                $project->modules()->syncWithoutDetaching([$module->id => [
                    'is_enabled' => true,
                    'settings' => [],
                ]]);
            }
        });
    }

    private function createIntegrations(): void
    {
        $this->command->info('   🔗 Criando integrações disponíveis...');

        $integrations = [
            [
                'name' => 'Google Analytics',
                'slug' => 'google-analytics',
                'description' => 'Integração com Google Analytics',
                'provider' => 'google',
                'type' => 'analytics',
                'is_active' => true,
                'configuration_schema' => [
                    'tracking_id' => ['type' => 'string', 'required' => true],
                    'measurement_id' => ['type' => 'string', 'required' => false],
                ],
            ],
            [
                'name' => 'Facebook Ads',
                'slug' => 'facebook-ads',
                'description' => 'Integração com Facebook Ads',
                'provider' => 'facebook',
                'type' => 'advertising',
                'is_active' => true,
                'configuration_schema' => [
                    'app_id' => ['type' => 'string', 'required' => true],
                    'app_secret' => ['type' => 'string', 'required' => true],
                    'access_token' => ['type' => 'string', 'required' => true],
                ],
            ],
            [
                'name' => 'Mailchimp',
                'slug' => 'mailchimp',
                'description' => 'Integração com Mailchimp',
                'provider' => 'mailchimp',
                'type' => 'email_marketing',
                'is_active' => true,
                'configuration_schema' => [
                    'api_key' => ['type' => 'string', 'required' => true],
                    'server' => ['type' => 'string', 'required' => true],
                ],
            ],
            [
                'name' => 'Stripe',
                'slug' => 'stripe',
                'description' => 'Integração com Stripe para pagamentos',
                'provider' => 'stripe',
                'type' => 'payment',
                'is_active' => true,
                'configuration_schema' => [
                    'publishable_key' => ['type' => 'string', 'required' => true],
                    'secret_key' => ['type' => 'string', 'required' => true],
                    'webhook_secret' => ['type' => 'string', 'required' => false],
                ],
            ],
        ];

        foreach ($integrations as $integrationData) {
            Integration::firstOrCreate([
                'slug' => $integrationData['slug'],
            ], $integrationData);
        }
    }

    private function createFolders(): void
    {
        $this->command->info('   📂 Criando estrutura de pastas...');

        $projects = Project::all();

        foreach ($projects as $project) {
            // Pasta raiz de templates
            $templatesFolder = Folder::firstOrCreate([
                'name' => 'Templates',
                'project_id' => $project->id,
                'parent_id' => null,
            ], [
                'description' => 'Templates de email e landing pages',
                'type' => 'templates',
            ]);

            // Subpastas de templates
            $templateSubfolders = ['Email Templates', 'Landing Pages', 'Social Media'];
            foreach ($templateSubfolders as $subfolderName) {
                Folder::firstOrCreate([
                    'name' => $subfolderName,
                    'project_id' => $project->id,
                    'parent_id' => $templatesFolder->id,
                ]);
            }

            // Pasta de mídia
            $mediaFolder = Folder::firstOrCreate([
                'name' => 'Mídia',
                'project_id' => $project->id,
                'parent_id' => null,
            ], [
                'description' => 'Arquivos de mídia e imagens',
                'type' => 'media',
            ]);

            // Pasta de relatórios
            Folder::firstOrCreate([
                'name' => 'Relatórios',
                'project_id' => $project->id,
                'parent_id' => null,
            ], [
                'description' => 'Relatórios e análises',
                'type' => 'reports',
            ]);
        }
    }

    private function createCustomFields(): void
    {
        $this->command->info('   🏷️ Criando campos customizados...');

        $projects = Project::all();

        foreach ($projects as $project) {
            // Campos para leads
            $leadFields = [
                [
                    'name' => 'Empresa',
                    'slug' => 'company',
                    'type' => 'text',
                    'entity_type' => 'lead',
                    'is_required' => false,
                ],
                [
                    'name' => 'Cargo',
                    'slug' => 'job_title',
                    'type' => 'text',
                    'entity_type' => 'lead',
                    'is_required' => false,
                ],
                [
                    'name' => 'Fonte do Lead',
                    'slug' => 'lead_source',
                    'type' => 'select',
                    'entity_type' => 'lead',
                    'options' => ['Website', 'Facebook', 'Google Ads', 'Indicação', 'Evento'],
                    'is_required' => true,
                ],
                [
                    'name' => 'Interesse Principal',
                    'slug' => 'main_interest',
                    'type' => 'multiselect',
                    'entity_type' => 'lead',
                    'options' => ['Marketing Digital', 'Vendas', 'Automação', 'Analytics', 'CRM'],
                    'is_required' => false,
                ],
            ];

            foreach ($leadFields as $fieldData) {
                $fieldData['project_id'] = $project->id;
                CustomField::firstOrCreate([
                    'slug' => $fieldData['slug'],
                    'project_id' => $project->id,
                    'entity_type' => $fieldData['entity_type'],
                ], $fieldData);
            }
        }
    }
}
