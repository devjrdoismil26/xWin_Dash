<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuraPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Permissões do módulo Aura
        $permissions = [
            // Conexões
            ['name' => 'aura.connections.view', 'display_name' => 'Visualizar Conexões', 'description' => 'Visualizar conexões do Aura', 'module' => 'aura', 'action' => 'view'],
            ['name' => 'aura.connections.create', 'display_name' => 'Criar Conexões', 'description' => 'Criar novas conexões', 'module' => 'aura', 'action' => 'create'],
            ['name' => 'aura.connections.update', 'display_name' => 'Atualizar Conexões', 'description' => 'Atualizar conexões existentes', 'module' => 'aura', 'action' => 'update'],
            ['name' => 'aura.connections.delete', 'display_name' => 'Deletar Conexões', 'description' => 'Deletar conexões', 'module' => 'aura', 'action' => 'delete'],
            ['name' => 'aura.connections.manage', 'display_name' => 'Gerenciar Conexões', 'description' => 'Conectar/desconectar dispositivos', 'module' => 'aura', 'action' => 'manage'],

            // Chats
            ['name' => 'aura.chats.view', 'display_name' => 'Visualizar Chats', 'description' => 'Visualizar conversas', 'module' => 'aura', 'action' => 'view'],
            ['name' => 'aura.chats.send-message', 'display_name' => 'Enviar Mensagens', 'description' => 'Enviar mensagens em chats', 'module' => 'aura', 'action' => 'send-message'],
            ['name' => 'aura.chats.assign', 'display_name' => 'Atribuir Chats', 'description' => 'Atribuir chats a agentes', 'module' => 'aura', 'action' => 'assign'],
            ['name' => 'aura.chats.close', 'display_name' => 'Fechar Chats', 'description' => 'Fechar conversas', 'module' => 'aura', 'action' => 'close'],
            ['name' => 'aura.chats.link-lead', 'display_name' => 'Vincular Leads', 'description' => 'Vincular leads aos chats', 'module' => 'aura', 'action' => 'link-lead'],

            // Fluxos
            ['name' => 'aura.flows.view', 'display_name' => 'Visualizar Fluxos', 'description' => 'Visualizar fluxos de conversa', 'module' => 'aura', 'action' => 'view'],
            ['name' => 'aura.flows.create', 'display_name' => 'Criar Fluxos', 'description' => 'Criar novos fluxos', 'module' => 'aura', 'action' => 'create'],
            ['name' => 'aura.flows.update', 'display_name' => 'Atualizar Fluxos', 'description' => 'Editar fluxos existentes', 'module' => 'aura', 'action' => 'update'],
            ['name' => 'aura.flows.delete', 'display_name' => 'Deletar Fluxos', 'description' => 'Deletar fluxos', 'module' => 'aura', 'action' => 'delete'],
            ['name' => 'aura.flows.start', 'display_name' => 'Iniciar Fluxos', 'description' => 'Iniciar execução de fluxos', 'module' => 'aura', 'action' => 'start'],

            // Webhooks
            ['name' => 'aura.webhooks.process', 'display_name' => 'Processar Webhooks', 'description' => 'Processar webhooks recebidos', 'module' => 'aura', 'action' => 'process'],
            ['name' => 'aura.webhooks.logs', 'display_name' => 'Ver Logs Webhooks', 'description' => 'Visualizar logs de webhooks', 'module' => 'aura', 'action' => 'logs'],

            // Analytics
            ['name' => 'aura.stats.view', 'display_name' => 'Visualizar Estatísticas', 'description' => 'Ver analytics do Aura', 'module' => 'aura', 'action' => 'view'],
            ['name' => 'aura.stats.export', 'display_name' => 'Exportar Relatórios', 'description' => 'Exportar relatórios', 'module' => 'aura', 'action' => 'export'],

            // AI
            ['name' => 'aura.ai.process', 'display_name' => 'Usar IA', 'description' => 'Usar funcionalidades de IA', 'module' => 'aura', 'action' => 'process'],
        ];

        // Inserir permissões
        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permission['name']],
                array_merge($permission, [
                    'id' => Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('Aura permissions seeded successfully!');
    }
}
