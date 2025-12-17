<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Services\AuraFlowService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuraFlowController extends Controller
{
    public function __construct(
        private readonly AuraFlowService $flowService
    ) {
    }

    /**
     * Lista todos os fluxos do usuário atual
     */
    public function index(): JsonResponse
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $flows = $this->flowService->getActiveFlows()
                ->where('user_id', $userId)
                ->map(function ($flow) {
                    return [
                        'id' => $flow->id,
                        'name' => $flow->name,
                        'description' => $flow->description,
                        'status' => $flow->status,
                        'is_active' => $flow->is_active,
                        'created_at' => $flow->created_at,
                        'updated_at' => $flow->updated_at,
                        'statistics' => $this->flowService->getFlowStatistics($flow->id)
                    ];
                });

            return response()->json([
                'data' => $flows,
                'meta' => [
                    'total' => $flows->count(),
                    'active' => $flows->where('is_active', true)->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar fluxos',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostra detalhes de um fluxo específico
     */
    public function show($id): JsonResponse
    {
        try {
            $flow = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel::find($id);

            if (!$flow) {
                return response()->json(['error' => 'Fluxo não encontrado'], 404);
            }

            // Verificar se o usuário tem acesso ao fluxo
            if ($flow->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            // Buscar estatísticas do fluxo
            $statistics = $this->flowService->getFlowStatistics($id);

            return response()->json([
                'data' => [
                    'flow' => $flow,
                    'statistics' => $statistics
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo fluxo
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:500',
                'structure' => 'required|array',
                'is_active' => 'boolean',
                'trigger_conditions' => 'nullable|array'
            ]);

            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            // Adicionar dados do usuário
            $validated['user_id'] = $userId;
            $validated['status'] = $validated['is_active'] ?? true ? 'active' : 'draft';

            // Criar fluxo
            $flow = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel::create($validated);

            return response()->json([
                'data' => $flow,
                'message' => 'Fluxo criado com sucesso'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um fluxo existente
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string|max:500',
                'structure' => 'sometimes|required|array',
                'is_active' => 'boolean',
                'trigger_conditions' => 'nullable|array'
            ]);

            $flow = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel::find($id);

            if (!$flow) {
                return response()->json(['error' => 'Fluxo não encontrado'], 404);
            }

            // Verificar se o usuário tem acesso ao fluxo
            if ($flow->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            // Atualizar status se is_active foi alterado
            if (isset($validated['is_active'])) {
                $validated['status'] = $validated['is_active'] ? 'active' : 'paused';
            }

            $flow->update($validated);

            return response()->json([
                'data' => $flow->fresh(),
                'message' => 'Fluxo atualizado com sucesso'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um fluxo
     */
    public function destroy($id): JsonResponse
    {
        try {
            $flow = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel::find($id);

            if (!$flow) {
                return response()->json(['error' => 'Fluxo não encontrado'], 404);
            }

            // Verificar se o usuário tem acesso ao fluxo
            if ($flow->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            $flow->delete();

            return response()->json([
                'message' => 'Fluxo removido com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao remover fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Inicia execução de um fluxo
     */
    public function execute(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'phone_number' => 'required|string',
                'variables' => 'nullable|array'
            ]);

            $result = $this->flowService->startFlow(
                $id,
                $validated['phone_number'],
                $validated['variables'] ?? []
            );

            if ($result['success']) {
                return response()->json([
                    'data' => $result,
                    'message' => 'Fluxo iniciado com sucesso'
                ]);
            } else {
                return response()->json([
                    'error' => 'Erro ao iniciar fluxo',
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao executar fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Pausa um fluxo ativo
     */
    public function pause($id): JsonResponse
    {
        try {
            $success = $this->flowService->pauseFlow($id);

            if ($success) {
                return response()->json(['message' => 'Fluxo pausado com sucesso']);
            } else {
                return response()->json(['error' => 'Erro ao pausar fluxo'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao pausar fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retoma um fluxo pausado
     */
    public function resume($id): JsonResponse
    {
        try {
            $success = $this->flowService->resumeFlow($id);

            if ($success) {
                return response()->json(['message' => 'Fluxo retomado com sucesso']);
            } else {
                return response()->json(['error' => 'Erro ao retomar fluxo'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao retomar fluxo',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
