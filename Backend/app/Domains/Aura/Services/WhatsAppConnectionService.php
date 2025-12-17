<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use Illuminate\Support\Facades\Log;

/**
 * Service especializado para gerenciamento de conexões WhatsApp
 *
 * Responsável por conectar, desconectar e validar conexões,
 * incluindo processamento de webhooks e estatísticas.
 */
class WhatsAppConnectionService
{
    public function __construct(
        private readonly AuraConnectionModel $connectionModel
    ) {
    }

    /**
     * Conecta uma conta WhatsApp
     */
    public function connect(string $connectionId): bool
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                Log::error('Tentativa de conectar conexão inexistente', [
                    'connection_id' => $connectionId
                ]);
                return false;
            }

            // Validar credenciais antes de conectar
            $validation = $this->validateConnection($connectionId);
            if (!$validation['success']) {
                Log::error('Falha na validação de conexão', [
                    'connection_id' => $connectionId,
                    'error' => $validation['error']
                ]);
                return false;
            }

            // Atualizar status da conexão
            $updated = $connection->update([
                'status' => 'connected',
                'is_active' => true,
                'connected_at' => now(),
                'last_activity' => now()
            ]);

            if ($updated) {
                Log::info('Conexão WhatsApp estabelecida', [
                    'connection_id' => $connectionId,
                    'user_id' => $connection->user_id
                ]);
            }

            return $updated;
        } catch (\Throwable $exception) {
            Log::error('Erro ao conectar WhatsApp', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId
            ]);
            return false;
        }
    }

    /**
     * Desconecta uma conta WhatsApp
     */
    public function disconnect(string $connectionId): bool
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                Log::error('Tentativa de desconectar conexão inexistente', [
                    'connection_id' => $connectionId
                ]);
                return false;
            }

            // Atualizar status da conexão
            $updated = $connection->update([
                'status' => 'disconnected',
                'is_active' => false,
                'disconnected_at' => now()
            ]);

            if ($updated) {
                Log::info('Conexão WhatsApp desconectada', [
                    'connection_id' => $connectionId,
                    'user_id' => $connection->user_id
                ]);
            }

            return $updated;
        } catch (\Throwable $exception) {
            Log::error('Erro ao desconectar WhatsApp', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId
            ]);
            return false;
        }
    }

    /**
     * Valida uma conexão WhatsApp
     */
    public function validateConnection(string $connectionId): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            // Verificar se as credenciais estão configuradas
            $credentials = $this->getConnectionCredentials($connection);
            if (empty($credentials['access_token']) || empty($credentials['phone_number_id'])) {
                return [
                    'success' => false,
                    'error' => 'Credenciais não configuradas'
                ];
            }

            // Verificar se o webhook está configurado
            $webhookUrl = $this->getWebhookUrl($connectionId);
            if (empty($webhookUrl)) {
                return [
                    'success' => false,
                    'error' => 'Webhook não configurado'
                ];
            }

            // Fazer chamada de teste para API do WhatsApp
            $testResult = $this->testApiConnection($credentials);
            if (!$testResult['success']) {
                return [
                    'success' => false,
                    'error' => 'Falha na conexão com API: ' . $testResult['error']
                ];
            }

            return [
                'success' => true,
                'connection_id' => $connectionId,
                'status' => 'valid',
                'webhook_url' => $webhookUrl,
                'phone_number' => $credentials['phone_number'] ?? null,
                'business_account' => $credentials['business_account_id'] ?? null
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro na validação de conexão', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno na validação',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Processa mensagem recebida via webhook
     */
    public function processIncomingMessage(string $connectionId, array $webhookData): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            // Verificar se a conexão está ativa
            if (!$connection->is_active) {
                return [
                    'success' => false,
                    'error' => 'Conexão inativa'
                ];
            }

            // Extrair dados da mensagem
            $messageData = $this->extractMessageData($webhookData);
            if (!$messageData) {
                return [
                    'success' => false,
                    'error' => 'Dados de mensagem inválidos'
                ];
            }

            // Atualizar última atividade
            $connection->update(['last_activity' => now()]);

            // Processar mensagem baseada no tipo
            $result = $this->processMessageByType($messageData, $connection);

            Log::info('Mensagem recebida processada', [
                'connection_id' => $connectionId,
                'message_id' => $messageData['id'] ?? null,
                'from' => $messageData['from'] ?? null,
                'type' => $messageData['type'] ?? null
            ]);

            return [
                'success' => true,
                'message_data' => $messageData,
                'processing_result' => $result
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao processar mensagem recebida', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'webhook_data' => $webhookData
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno no processamento',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Obtém URL do webhook para uma conexão
     */
    public function getWebhookUrl(string $connectionId): string
    {
        $baseUrl = config('app.url');
        return "{$baseUrl}/api/aura/webhook/whatsapp/{$connectionId}";
    }

    /**
     * Obtém estatísticas de uma conexão
     * Otimização: Cache de 5 minutos
     */
    public function getConnectionStatistics(string $connectionId): array
    {
        $cacheKey = "aura_connection_stats_{$connectionId}";
        
        return Cache::remember($cacheKey, 300, function () use ($connectionId) {
            try {
                $connection = $this->getConnection($connectionId);
                if (!$connection) {
                    return [
                        'success' => false,
                        'error' => 'Conexão não encontrada'
                    ];
                }

                // Otimização: Calcular estatísticas em queries otimizadas
                // Calcular estatísticas básicas
                $stats = [
                    'connection_id' => $connectionId,
                    'status' => $connection->status,
                    'is_active' => $connection->is_active,
                    'connected_at' => $connection->connected_at,
                    'last_activity' => $connection->last_activity,
                    'total_messages_sent' => $this->getTotalMessagesSent($connectionId),
                    'total_messages_received' => $this->getTotalMessagesReceived($connectionId),
                    'uptime_percentage' => $this->calculateUptimePercentage($connection),
                    'average_response_time' => $this->getAverageResponseTime($connectionId),
                    'error_rate' => $this->getErrorRate($connectionId)
                ];

                return [
                    'success' => true,
                    'statistics' => $stats,
                    'generated_at' => now()
                ];
            } catch (\Throwable $exception) {
                Log::error('Erro ao obter estatísticas da conexão', [
                    'error' => $exception->getMessage(),
                    'connection_id' => $connectionId
                ]);

                return [
                    'success' => false,
                    'error' => 'Erro interno ao obter estatísticas',
                    'details' => $exception->getMessage()
                ];
            }
        });
    }

    // ===== MÉTODOS AUXILIARES =====

    /**
     * Obtém conexão por ID
     */
    private function getConnection(string $connectionId): ?AuraConnectionModel
    {
        return $this->connectionModel->find($connectionId);
    }

    /**
     * Obtém credenciais de uma conexão
     */
    private function getConnectionCredentials(AuraConnectionModel $connection): array
    {
        return [
            'access_token' => $connection->access_token,
            'phone_number_id' => $connection->phone_number_id,
            'phone_number' => $connection->phone_number,
            'business_account_id' => $connection->business_account_id,
            'webhook_verify_token' => $connection->webhook_verify_token
        ];
    }

    /**
     * Testa conexão com API do WhatsApp
     */
    private function testApiConnection(array $credentials): array
    {
        try {
            // Implementar teste real de conexão com API
            // Por enquanto, simula sucesso
            return [
                'success' => true,
                'response_time' => 150
            ];
        } catch (\Throwable $exception) {
            return [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }
    }

    /**
     * Extrai dados da mensagem do webhook
     */
    private function extractMessageData(array $webhookData): ?array
    {
        // Implementar extração de dados do webhook do WhatsApp
        // Por enquanto, retorna dados simulados
        return [
            'id' => $webhookData['entry'][0]['changes'][0]['value']['messages'][0]['id'] ?? null,
            'from' => $webhookData['entry'][0]['changes'][0]['value']['messages'][0]['from'] ?? null,
            'type' => $webhookData['entry'][0]['changes'][0]['value']['messages'][0]['type'] ?? null,
            'timestamp' => $webhookData['entry'][0]['changes'][0]['value']['messages'][0]['timestamp'] ?? null,
            'text' => $webhookData['entry'][0]['changes'][0]['value']['messages'][0]['text']['body'] ?? null
        ];
    }

    /**
     * Processa mensagem baseada no tipo
     */
    private function processMessageByType(array $messageData, AuraConnectionModel $connection): array
    {
        $messageType = $messageData['type'] ?? 'unknown';

        switch ($messageType) {
            case 'text':
                return $this->processTextMessage($messageData, $connection);
            case 'image':
            case 'video':
            case 'audio':
            case 'document':
                return $this->processMediaMessage($messageData, $connection);
            case 'location':
                return $this->processLocationMessage($messageData, $connection);
            case 'contacts':
                return $this->processContactMessage($messageData, $connection);
            default:
                return [
                    'processed' => false,
                    'reason' => 'Tipo de mensagem não suportado'
                ];
        }
    }

    /**
     * Processa mensagem de texto
     */
    private function processTextMessage(array $messageData, AuraConnectionModel $connection): array
    {
        // Implementar processamento de mensagem de texto
        return [
            'processed' => true,
            'type' => 'text',
            'content' => $messageData['text'] ?? ''
        ];
    }

    /**
     * Processa mensagem de mídia
     */
    private function processMediaMessage(array $messageData, AuraConnectionModel $connection): array
    {
        // Implementar processamento de mensagem de mídia
        return [
            'processed' => true,
            'type' => 'media',
            'media_type' => $messageData['type'] ?? 'unknown'
        ];
    }

    /**
     * Processa mensagem de localização
     */
    private function processLocationMessage(array $messageData, AuraConnectionModel $connection): array
    {
        // Implementar processamento de mensagem de localização
        return [
            'processed' => true,
            'type' => 'location'
        ];
    }

    /**
     * Processa mensagem de contato
     */
    private function processContactMessage(array $messageData, AuraConnectionModel $connection): array
    {
        // Implementar processamento de mensagem de contato
        return [
            'processed' => true,
            'type' => 'contacts'
        ];
    }

    /**
     * Obtém total de mensagens enviadas
     */
    private function getTotalMessagesSent(string $connectionId): int
    {
        try {
            return \DB::table('aura_messages')
                ->where('connection_id', $connectionId)
                ->where('direction', 'outbound')
                ->count();
        } catch (\Exception $e) {
            Log::warning("Erro ao obter total de mensagens enviadas: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Obtém total de mensagens recebidas
     */
    private function getTotalMessagesReceived(string $connectionId): int
    {
        try {
            return \DB::table('aura_messages')
                ->where('connection_id', $connectionId)
                ->where('direction', 'inbound')
                ->count();
        } catch (\Exception $e) {
            Log::warning("Erro ao obter total de mensagens recebidas: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Calcula porcentagem de uptime
     */
    private function calculateUptimePercentage(AuraConnectionModel $connection): float
    {
        if (!$connection->connected_at) {
            return 0.0;
        }

        $totalTime = now()->diffInMinutes($connection->connected_at);
        $uptime = $connection->is_active ? $totalTime : 0;

        return $totalTime > 0 ? round(($uptime / $totalTime) * 100, 2) : 0.0;
    }

    /**
     * Obtém tempo médio de resposta
     */
    private function getAverageResponseTime(string $connectionId): float
    {
        try {
            $avgTime = \DB::table('aura_messages')
                ->where('connection_id', $connectionId)
                ->where('direction', 'outbound')
                ->whereNotNull('response_time_ms')
                ->avg('response_time_ms');

            return $avgTime ? round($avgTime / 1000, 2) : 0.0; // Converter ms para segundos
        } catch (\Exception $e) {
            Log::warning("Erro ao obter tempo médio de resposta: " . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Obtém taxa de erro
     */
    private function getErrorRate(string $connectionId): float
    {
        try {
            $total = \DB::table('aura_messages')
                ->where('connection_id', $connectionId)
                ->count();

            if ($total == 0) {
                return 0.0;
            }

            $errors = \DB::table('aura_messages')
                ->where('connection_id', $connectionId)
                ->where('status', 'failed')
                ->count();

            return round(($errors / $total) * 100, 2);
        } catch (\Exception $e) {
            Log::warning("Erro ao obter taxa de erro: " . $e->getMessage());
            return 0.0;
        }
    }
}
