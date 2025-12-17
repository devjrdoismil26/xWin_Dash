<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\ApiCredential;

class UsersAuthSeeder extends Seeder
{
    /**
     * 🔐 SEEDER MESTRE: USERS & AUTH.
     *
     * Seeder principal para o domínio de usuários e autenticação
     * Inclui: users, roles, permissions, api_credentials, etc.
     */
    public function run(): void
    {
        $this->command->info('🔐 Iniciando seeding de Users & Auth...');

        // 1. Criar permissões básicas
        $this->createPermissions();

        // 2. Criar roles padrão
        $this->createRoles();

        // 3. Criar usuários administrativos
        $this->createAdminUsers();

        // 4. Criar usuários de exemplo
        $this->createSampleUsers();

        // 5. Criar credenciais de API de exemplo
        $this->createApiCredentials();

        $this->command->info('✅ Users & Auth seeding concluído!');
    }

    private function createPermissions(): void
    {
        $this->command->info('   📋 Criando permissões...');

        $permissions = [
            // Gerais
            'admin.access' => 'Acessar painel administrativo',
            'users.view' => 'Visualizar usuários',
            'users.create' => 'Criar usuários',
            'users.edit' => 'Editar usuários',
            'users.delete' => 'Deletar usuários',

            // Projetos
            'projects.view' => 'Visualizar projetos',
            'projects.create' => 'Criar projetos',
            'projects.edit' => 'Editar projetos',
            'projects.delete' => 'Deletar projetos',

            // Leads
            'leads.view' => 'Visualizar leads',
            'leads.create' => 'Criar leads',
            'leads.edit' => 'Editar leads',
            'leads.delete' => 'Deletar leads',

            // Email Marketing
            'email.campaigns.view' => 'Visualizar campanhas de email',
            'email.campaigns.create' => 'Criar campanhas de email',
            'email.campaigns.send' => 'Enviar campanhas de email',

            // Analytics
            'analytics.view' => 'Visualizar analytics',
            'analytics.advanced' => 'Analytics avançado',

            // Sistema
            'system.settings' => 'Configurações do sistema',
            'system.backups' => 'Gerenciar backups',
            'system.logs' => 'Visualizar logs',
        ];

        foreach ($permissions as $name => $description) {
            Permission::firstOrCreate([
                'name' => $name,
            ], [
                'guard_name' => 'web',
                'description' => $description,
            ]);
        }
    }

    private function createRoles(): void
    {
        $this->command->info('   👑 Criando roles...');

        // Super Admin
        $superAdmin = Role::firstOrCreate([
            'name' => 'super_admin',
        ], [
            'guard_name' => 'web',
            'description' => 'Super Administrador - Acesso total',
        ]);
        $superAdmin->syncPermissions(Permission::all());

        // Admin
        $admin = Role::firstOrCreate([
            'name' => 'admin',
        ], [
            'guard_name' => 'web',
            'description' => 'Administrador - Acesso administrativo',
        ]);
        $admin->syncPermissions(Permission::whereIn('name', [
            'admin.access', 'users.view', 'users.create', 'users.edit',
            'projects.view', 'projects.create', 'projects.edit',
            'leads.view', 'leads.create', 'leads.edit',
            'email.campaigns.view', 'email.campaigns.create', 'email.campaigns.send',
            'analytics.view', 'analytics.advanced',
        ])->get());

        // Manager
        $manager = Role::firstOrCreate([
            'name' => 'manager',
        ], [
            'guard_name' => 'web',
            'description' => 'Gerente - Acesso de gestão',
        ]);
        $manager->syncPermissions(Permission::whereIn('name', [
            'users.view', 'projects.view', 'projects.create', 'projects.edit',
            'leads.view', 'leads.create', 'leads.edit',
            'email.campaigns.view', 'email.campaigns.create',
            'analytics.view',
        ])->get());

        // User
        $user = Role::firstOrCreate([
            'name' => 'user',
        ], [
            'guard_name' => 'web',
            'description' => 'Usuário - Acesso básico',
        ]);
        $user->syncPermissions(Permission::whereIn('name', [
            'projects.view', 'leads.view', 'leads.create',
            'email.campaigns.view', 'analytics.view',
        ])->get());
    }

    private function createAdminUsers(): void
    {
        $this->command->info('   👤 Criando usuários administrativos...');

        // Super Admin
        $superAdmin = User::firstOrCreate([
            'email' => 'admin@xwindash.com',
        ], [
            'name' => 'Super Administrator',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'is_active' => true,
            'timezone' => 'America/Sao_Paulo',
            'language' => 'pt-BR',
        ]);
        $superAdmin->assignRole('super_admin');

        // Admin Demo
        $admin = User::firstOrCreate([
            'email' => 'demo@xwindash.com',
        ], [
            'name' => 'Demo Administrator',
            'password' => bcrypt('demo123'),
            'email_verified_at' => now(),
            'is_active' => true,
            'timezone' => 'America/Sao_Paulo',
            'language' => 'pt-BR',
        ]);
        $admin->assignRole('admin');
    }

    private function createSampleUsers(): void
    {
        $this->command->info('   👥 Criando usuários de exemplo...');

        // Criar 10 usuários de exemplo
        User::factory(10)->create()->each(function ($user) {
            $user->assignRole(['user', 'manager'][rand(0, 1)]);
        });
    }

    private function createApiCredentials(): void
    {
        $this->command->info('   🔑 Criando credenciais de API...');

        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['super_admin', 'admin']);
        })->get();

        foreach ($users as $user) {
            ApiCredential::factory(2)->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
