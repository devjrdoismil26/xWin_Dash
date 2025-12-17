<?php

namespace Database\Seeders;

use App\Domains$1\Domain$2;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AIMessageSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for AIMessage.
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
                        AIMessage::truncate();
                    }

        $this->command->info('Seeding AIMessage...');

        // Criar mensagens para conversas existentes
        $conversations = AIConversation::take(10)->get();

        foreach ($conversations as $conversation) {
            // Mensagem inicial do usuário
            AIMessage::factory()->create([
                'conversation_id' => $conversation->id,
                'role' => 'user',
                'content' => 'Olá! Preciso de ajuda com marketing digital.',
            ]);

            // Resposta do assistente
            AIMessage::factory()->create([
                'conversation_id' => $conversation->id,
                'role' => 'assistant',
                'content' => 'Claro! Posso ajudá-lo com estratégias de marketing digital. Em que área específica você gostaria de focar?',
            ]);

            // Mais mensagens aleatórias
            AIMessage::factory()
                ->count(rand(3, 15))
                ->create([
                    'conversation_id' => $conversation->id,
                ]);
        }

        $this->command->info('AIMessage seeded successfully!');
    
}
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
}
}
