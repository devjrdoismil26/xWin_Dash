<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Support\Str;

class DevelopmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar usuário de desenvolvimento
        $user = User::firstOrCreate(
            ['email' => 'dev@xwindash.com'],
            [
                'name' => 'Desenvolvedor',
                'password' => bcrypt('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Criar projetos de exemplo
        $project1 = ProjectModel::firstOrCreate(
            ['slug' => 'projeto-principal'],
            [
                'name' => 'Projeto Principal',
                'description' => 'Projeto principal para desenvolvimento e testes',
                'owner_id' => $user->id,
                'is_active' => true,
                'timezone' => 'America/Sao_Paulo',
                'currency' => 'BRL',
                'settings' => [
                    'theme' => 'default',
                    'notifications' => true,
                ],
                'modules' => [
                    'leads' => true,
                    'email_marketing' => true,
                    'social_buffer' => true,
                    'aura' => true,
                    'adstool' => true,
                    'ai' => true,
                    'analytics' => true,
                    'media' => true,
                ]
            ]
        );

        $project2 = ProjectModel::firstOrCreate(
            ['slug' => 'projeto-teste'],
            [
                'name' => 'Projeto de Teste',
                'description' => 'Projeto secundário para testes de funcionalidades',
                'owner_id' => $user->id,
                'is_active' => true,
                'timezone' => 'America/Sao_Paulo',
                'currency' => 'BRL',
                'settings' => [
                    'theme' => 'dark',
                    'notifications' => false,
                ],
                'modules' => [
                    'leads' => true,
                    'email_marketing' => false,
                    'social_buffer' => true,
                    'aura' => false,
                    'adstool' => false,
                    'ai' => true,
                    'analytics' => true,
                    'media' => true,
                ]
            ]
        );

        // Definir projeto principal como ativo para o usuário
        $user->update(['current_project_id' => $project1->id]);

        $this->command->info('✅ Dados de desenvolvimento criados com sucesso!');
        $this->command->info("👤 Usuário: {$user->email} / password");
        $this->command->info("🏢 Projeto Principal: {$project1->name}");
        $this->command->info("🧪 Projeto de Teste: {$project2->name}");
    }
}