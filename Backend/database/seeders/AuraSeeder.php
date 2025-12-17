<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;

class AuraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Criar conexões Aura
        $connections = AuraConnection::factory()->count(3)->create();

        // Para cada conexão, criar chats, mensagens, fluxos e sessões URA
        $connections->each(function ($connection) {
            // Criar chats para a conexão
            $chats = AuraChat::factory()->count(5)->create(['aura_connection_id' => $connection->id]);

            $chats->each(function ($chat) {
                // Criar mensagens para cada chat
                AuraMessage::factory()->count(20)->create(['aura_chat_id' => $chat->id]);

                // Criar sessões URA para cada chat
                AuraUraSession::factory()->count(2)->create(['aura_chat_id' => $chat->id]);
            });

            // Criar fluxos para o projeto da conexão
            $flows = AuraFlow::factory()->count(2)->create(['project_id' => $connection->project_id]);

            $flows->each(function ($flow) {
                // Criar nós para cada fluxo
                AuraFlowNode::factory()->count(5)->create(['aura_flow_id' => $flow->id]);
            });

            // Criar templates para o projeto da conexão
            AuraTemplate::factory()->count(4)->create(['project_id' => $connection->project_id]);
        });

        $this->command->info('Aura seeded!');
    }
}
