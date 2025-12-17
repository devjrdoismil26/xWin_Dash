<?php

namespace App\Domains\Integrations\Services\Providers;

class WhatsAppProvider extends BaseProvider
{
    public function testConnection(): array
    {
        $credentials = $this->getCredentials();
        
        if (!$credentials || !isset($credentials['api_key'])) {
            throw new \Exception('Missing API key');
        }

        return ['status' => 'connected', 'phone' => $credentials['phone_number'] ?? null];
    }

    public function sync(): array
    {
        try {
            $credentials = $this->getCredentials();
            
            if (!$credentials) {
                throw new \Exception('Missing credentials');
            }

            $syncedCount = 0;
            $syncedData = [];

            // Integrar com módulo Aura para sincronizar contatos e mensagens
            $connectionId = $credentials['connection_id'] ?? null;
            
            if ($connectionId) {
                // Sincronizar contatos via Aura
                $contacts = $this->syncContacts($connectionId);
                $syncedCount += count($contacts);
                $syncedData['contacts'] = $contacts;

                // Sincronizar mensagens via Aura
                $messages = $this->syncMessages($connectionId);
                $syncedCount += count($messages);
                $syncedData['messages'] = $messages;
            } else {
                // Sincronizar todas as conexões do usuário
                $connections = $this->syncAllConnections();
                $syncedCount += count($connections);
                $syncedData['connections'] = $connections;
            }

            return [
                'count' => $syncedCount,
                'message' => "Sincronizados {$syncedCount} itens do WhatsApp",
                'data' => $syncedData
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WhatsApp sync failed', [
                'error' => $e->getMessage()
            ]);
            return [
                'count' => 0,
                'message' => 'Erro ao sincronizar WhatsApp: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Sincroniza contatos do WhatsApp via Aura
     */
    protected function syncContacts(?string $connectionId): array
    {
        try {
            if (!$connectionId) {
                return [];
            }

            // Buscar chats do Aura
            $chats = \DB::table('aura_chats')
                ->where('connection_id', $connectionId)
                ->get();

            $contacts = [];
            foreach ($chats as $chat) {
                $contacts[] = [
                    'phone' => $chat->contact_phone,
                    'name' => $chat->contact_name,
                    'is_business' => $chat->is_business ?? false
                ];

                // Salvar no banco de sincronização
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'whatsapp',
                        'external_id' => $chat->contact_phone,
                        'type' => 'contact'
                    ],
                    [
                        'data' => json_encode([
                            'phone' => $chat->contact_phone,
                            'name' => $chat->contact_name,
                            'chat_id' => $chat->id
                        ]),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $contacts;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('WhatsApp contacts sync failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza mensagens do WhatsApp via Aura
     */
    protected function syncMessages(?string $connectionId): array
    {
        try {
            if (!$connectionId) {
                return [];
            }

            // Buscar mensagens recentes do Aura
            $messages = \DB::table('aura_messages')
                ->whereHas('chat', function ($q) use ($connectionId) {
                    $q->where('connection_id', $connectionId);
                })
                ->where('created_at', '>=', now()->subDays(30))
                ->limit(1000)
                ->get();

            $syncedMessages = [];
            foreach ($messages as $message) {
                $syncedMessages[] = [
                    'id' => $message->id,
                    'direction' => $message->direction,
                    'type' => $message->type
                ];

                // Salvar no banco de sincronização
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'whatsapp',
                        'external_id' => $message->id,
                        'type' => 'message'
                    ],
                    [
                        'data' => json_encode($message),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $syncedMessages;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('WhatsApp messages sync failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza todas as conexões do usuário
     */
    protected function syncAllConnections(): array
    {
        try {
            $userId = auth()->id();
            $connections = \DB::table('aura_connections')
                ->where('user_id', $userId)
                ->where('status', 'connected')
                ->get();

            $syncedConnections = [];
            foreach ($connections as $connection) {
                $syncedConnections[] = [
                    'id' => $connection->id,
                    'name' => $connection->name,
                    'phone_number' => $connection->phone_number
                ];
            }

            return $syncedConnections;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('WhatsApp connections sync failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getAuthUrl(): string
    {
        return '';
    }

    public function handleCallback(array $params): array
    {
        return [];
    }
}
