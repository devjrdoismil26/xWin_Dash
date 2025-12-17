<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Services\WhatsAppService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuraConnectionController extends Controller
{
    public function __construct(
        private readonly WhatsAppService $whatsAppService
    ) {
    }

    /**
     * Lista todas as conexões do usuário atual
     */
    public function index(): JsonResponse
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $connections = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($connection) {
                    $statistics = $this->whatsAppService->getConnectionStatistics($connection->id);

                    return [
                        'id' => $connection->id,
                        'name' => $connection->name,
                        'description' => $connection->description,
                        'phone_number' => $connection->phone_number,
                        'status' => $connection->status,
                        'is_active' => $connection->is_active,
                        'created_at' => $connection->created_at,
                        'updated_at' => $connection->updated_at,
                        'last_tested_at' => $connection->last_tested_at,
                        'last_error' => $connection->last_error,
                        'statistics' => $statistics,
                        'webhook_url' => $this->whatsAppService->getWebhookUrl($connection->id)
                    ];
                });

            return response()->json([
                'data' => $connections,
                'meta' => [
                    'total' => $connections->count(),
                    'active' => $connections->where('is_active', true)->count(),
                    'connected' => $connections->where('status', 'connected')->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar conexões',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostra detalhes de uma conexão específica
     */
    public function show($id): JsonResponse
    {
        try {
            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::find($id);

            if (!$connection) {
                return response()->json(['error' => 'Conexão não encontrada'], 404);
            }

            // Verificar se o usuário tem acesso à conexão
            if ($connection->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            // Buscar estatísticas detalhadas
            $statistics = $this->whatsAppService->getConnectionStatistics($id);

            return response()->json([
                'data' => [
                    'connection' => $connection,
                    'statistics' => $statistics,
                    'webhook_url' => $this->whatsAppService->getWebhookUrl($id)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar conexão',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria uma nova conexão
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:500',
                'phone_number' => 'required|string|max:20',
                'access_token' => 'required|string',
                'phone_number_id' => 'required|string',
                'business_account_id' => 'required|string',
                'webhook_verify_token' => 'nullable|string'
            ]);

            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            // Adicionar dados do usuário
            $validated['user_id'] = $userId;
            $validated['status'] = 'disconnected';
            $validated['is_active'] = false;

            // Criar conexão
            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::create($validated);

            // Testar conexão imediatamente
            $testResult = $this->whatsAppService->validateConnection($connection->id);

            return response()->json([
                'data' => $connection->fresh(),
                'test_result' => $testResult,
                'message' => 'Conexão criada com sucesso'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar conexão',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza uma conexão existente
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string|max:500',
                'phone_number' => 'sometimes|required|string|max:20',
                'access_token' => 'sometimes|required|string',
                'phone_number_id' => 'sometimes|required|string',
                'business_account_id' => 'sometimes|required|string',
                'webhook_verify_token' => 'nullable|string'
            ]);

            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::find($id);

            if (!$connection) {
                return response()->json(['error' => 'Conexão não encontrada'], 404);
            }

            // Verificar se o usuário tem acesso à conexão
            if ($connection->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            $connection->update($validated);

            // Se credenciais foram atualizadas, testar conexão
            if (isset($validated['access_token']) || isset($validated['phone_number_id'])) {
                $testResult = $this->whatsAppService->validateConnection($connection->id);

                return response()->json([
                    'data' => $connection->fresh(),
                    'test_result' => $testResult,
                    'message' => 'Conexão atualizada e testada com sucesso'
                ]);
            }

            return response()->json([
                'data' => $connection->fresh(),
                'message' => 'Conexão atualizada com sucesso'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar conexão',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove uma conexão
     */
    public function destroy($id): JsonResponse
    {
        try {
            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::find($id);

            if (!$connection) {
                return response()->json(['error' => 'Conexão não encontrada'], 404);
            }

            // Verificar se o usuário tem acesso à conexão
            if ($connection->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            // Desconectar antes de excluir
            if ($connection->is_active) {
                $this->whatsAppService->disconnect($id);
            }

            $connection->delete();

            return response()->json([
                'message' => 'Conexão removida com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao remover conexão',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Testa conectividade de uma conexão
     */
    public function test($id): JsonResponse
    {
        try {
            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::find($id);

            if (!$connection) {
                return response()->json(['error' => 'Conexão não encontrada'], 404);
            }

            // Verificar acesso
            if ($connection->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            $result = $this->whatsAppService->validateConnection($id);

            return response()->json([
                'data' => $result,
                'message' => $result['success'] ? 'Teste realizado com sucesso' : 'Falha no teste de conectividade'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao testar conexão',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Conecta uma conexão ao WhatsApp
     */
    public function connect($id): JsonResponse
    {
        try {
            $success = $this->whatsAppService->connect($id);

            if ($success) {
                return response()->json(['message' => 'Conectado ao WhatsApp com sucesso']);
            } else {
                return response()->json(['error' => 'Erro ao conectar ao WhatsApp'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao conectar',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Desconecta uma conexão do WhatsApp
     */
    public function disconnect($id): JsonResponse
    {
        try {
            $success = $this->whatsAppService->disconnect($id);

            if ($success) {
                return response()->json(['message' => 'Desconectado do WhatsApp com sucesso']);
            } else {
                return response()->json(['error' => 'Erro ao desconectar do WhatsApp'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao desconectar',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém estatísticas de uma conexão
     */
    public function statistics($id): JsonResponse
    {
        try {
            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::find($id);

            if (!$connection) {
                return response()->json(['error' => 'Conexão não encontrada'], 404);
            }

            // Verificar acesso
            if ($connection->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            $statistics = $this->whatsAppService->getConnectionStatistics($id);

            return response()->json([
                'data' => $statistics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar estatísticas',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém URL do webhook
     */
    public function webhookUrl($id): JsonResponse
    {
        try {
            $connection = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel::find($id);

            if (!$connection) {
                return response()->json(['error' => 'Conexão não encontrada'], 404);
            }

            // Verificar acesso
            if ($connection->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            $webhookUrl = $this->whatsAppService->getWebhookUrl($id);

            return response()->json([
                'data' => [
                    'webhook_url' => $webhookUrl,
                    'verify_token' => $connection->webhook_verify_token
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao obter URL do webhook',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
