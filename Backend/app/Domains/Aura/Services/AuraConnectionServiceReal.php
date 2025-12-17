<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Services\AuraConnectionService;
use App\Domains\Aura\Services\WhatsAppConnectionService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

/**
 * Aura Connection Service (Real Implementation)
 * 
 * Real implementation of the Aura connection service.
 * Integrates with AuraConnectionService and WhatsAppConnectionService for actual platform connections.
 */
class AuraConnectionServiceReal
{
    protected AuraConnectionService $auraConnectionService;
    protected WhatsAppConnectionService $whatsAppConnectionService;

    public function __construct(
        AuraConnectionService $auraConnectionService,
        WhatsAppConnectionService $whatsAppConnectionService
    ) {
        $this->auraConnectionService = $auraConnectionService;
        $this->whatsAppConnectionService = $whatsAppConnectionService;
    }

    /**
     * Establish a new connection.
     * 
     * @param array $config
     * @return array
     */
    public function establishConnection(array $config): array
    {
        try {
            Log::info("AuraConnectionServiceReal::establishConnection - starting", [
                'connection_type' => $config['connection_type'] ?? 'unknown',
                'provider' => $config['provider'] ?? 'unknown'
            ]);

            // Validar credenciais antes de criar conexão
            $validation = $this->validateCredentials($config['credentials'] ?? []);
            if (!$validation['valid']) {
                return [
                    'success' => false,
                    'connection_id' => null,
                    'message' => 'Credenciais inválidas: ' . ($validation['message'] ?? 'Unknown error')
                ];
            }

            // Criar conexão usando AuraConnectionService
            $connection = $this->auraConnectionService->create([
                'name' => $config['name'] ?? 'Nova Conexão',
                'description' => $config['description'] ?? null,
                'provider' => $config['provider'] ?? 'whatsapp',
                'phone_number' => $config['phone_number'] ?? '',
                'business_name' => $config['business_name'] ?? null,
                'credentials' => $config['credentials'] ?? [],
                'settings' => $config['settings'] ?? [],
                'webhook_config' => $config['webhook_config'] ?? [],
                'project_id' => $config['project_id'] ?? session('selected_project_id'),
            ]);

            // Conectar usando WhatsAppConnectionService se for WhatsApp
            if (($config['provider'] ?? 'whatsapp') === 'whatsapp') {
                $connectResult = $this->whatsAppConnectionService->connect($connection->id);
                
                if (!$connectResult) {
                    Log::warning("Falha ao conectar WhatsApp após criar conexão", [
                        'connection_id' => $connection->id
                    ]);
                }
            }

            Log::info("AuraConnectionServiceReal::establishConnection - success", [
                'connection_id' => $connection->id
            ]);

            return [
                'success' => true,
                'connection_id' => $connection->id,
                'message' => 'Conexão estabelecida com sucesso',
                'status' => $connection->status
            ];
        } catch (\Exception $e) {
            Log::error("AuraConnectionServiceReal::establishConnection - error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'connection_id' => null,
                'message' => 'Erro ao estabelecer conexão: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Validate connection credentials.
     * 
     * @param array $credentials
     * @return array
     */
    public function validateCredentials(array $credentials): array
    {
        try {
            // Validar estrutura básica das credenciais
            if (empty($credentials)) {
                return [
                    'success' => false,
                    'valid' => false,
                    'message' => 'Credenciais não fornecidas'
                ];
            }

            // Validar credenciais do WhatsApp (token, phone_number_id, business_account_id)
            if (isset($credentials['provider']) && $credentials['provider'] === 'whatsapp') {
                $required = ['access_token', 'phone_number_id', 'business_account_id'];
                $missing = array_filter($required, fn($key) => empty($credentials[$key]));

                if (!empty($missing)) {
                    return [
                        'success' => false,
                        'valid' => false,
                        'message' => 'Credenciais do WhatsApp incompletas. Faltam: ' . implode(', ', $missing)
                    ];
                }

                // Validação básica de formato
                if (!is_string($credentials['access_token']) || strlen($credentials['access_token']) < 10) {
                    return [
                        'success' => false,
                        'valid' => false,
                        'message' => 'Token de acesso inválido'
                    ];
                }
            }

            // Validação genérica para outros provedores
            if (empty($credentials['access_token']) && empty($credentials['api_key'])) {
                return [
                    'success' => false,
                    'valid' => false,
                    'message' => 'Token de acesso ou API key não fornecidos'
                ];
            }

            Log::info("AuraConnectionServiceReal::validateCredentials - valid", [
                'provider' => $credentials['provider'] ?? 'unknown'
            ]);

            return [
                'success' => true,
                'valid' => true,
                'message' => 'Credenciais válidas'
            ];
        } catch (\Exception $e) {
            Log::error("AuraConnectionServiceReal::validateCredentials - error", [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'valid' => false,
                'message' => 'Erro ao validar credenciais: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Test connection status.
     * 
     * @param string $connectionId
     * @return array
     */
    public function testConnection(string $connectionId): array
    {
        try {
            $connection = AuraConnectionModel::findOrFail($connectionId);
            
            // Verificar status da conexão
            $stats = $this->whatsAppConnectionService->getConnectionStatistics($connectionId);
            
            return [
                'success' => true,
                'connection_id' => $connectionId,
                'status' => $connection->status,
                'is_active' => $connection->status === 'connected',
                'statistics' => $stats,
                'last_activity' => $connection->last_activity_at?->toIso8601String()
            ];
        } catch (\Exception $e) {
            Log::error("AuraConnectionServiceReal::testConnection - error", [
                'connection_id' => $connectionId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao testar conexão: ' . $e->getMessage()
            ];
        }
    }
}
