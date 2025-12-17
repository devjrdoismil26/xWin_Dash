<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Http\Requests\StoreWorkflowRequest;
use App\Domains\Workflows\Http\Requests\UpdateWorkflowRequest;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Services\WorkflowCanvasService;
use App\Domains\Workflows\Models\Workflow;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * 📋 Workflow Management API Controller
 *
 * Controller especializado para operações de gerenciamento de workflows
 * Responsável por CRUD e operações de configuração
 * 
 * SECURITY FIX (AUTH-002): Implementada autorização em todos os métodos
 */
class WorkflowManagementApiController extends Controller
{
    public function __construct(
        private WorkflowService $workflowService,
        private WorkflowCanvasService $canvasService
    ) {
    }

    /**
     * Listar workflows
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // SECURITY: Verificar autorização para listar
            $this->authorize('viewAny', Workflow::class);

            $filters = $request->only(['status', 'type', 'priority', 'project_id']);
            $limit = $request->get('limit', 20);
            $offset = $request->get('offset', 0);

            $workflows = $this->workflowService->getWorkflows(
                Auth::id(),
                $filters,
                $limit,
                $offset
            );

            return response()->json([
                'success' => true,
                'data' => $workflows
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view workflows'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao listar workflows. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to list workflows',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Criar workflow
     */
    public function store(StoreWorkflowRequest $request): JsonResponse
    {
        try {
            // SECURITY: Verificar autorização para criar
            $this->authorize('create', Workflow::class);

            Log::info("API: Recebida requisição para criar workflow.");

            $data = array_merge($request->validated(), [
                'project_id' => session('selected_project_id'),
            ]);

            $workflow = $this->workflowService->createWorkflow(
                $data,
                Auth::id()
            );

            Log::info("API: Workflow criado com sucesso. ID: {$workflow->id}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow created successfully',
                'data' => $workflow
            ], 201);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to create workflows'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao criar workflow. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to create workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter workflow específico
     */
    public function show(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para visualizar
            $this->authorize('view', $workflow);

            return response()->json([
                'success' => true,
                'data' => $workflow
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar workflow
     */
    public function update(UpdateWorkflowRequest $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para atualizar
            $this->authorize('update', $workflow);

            Log::info("API: Recebida requisição para atualizar workflow ID: {$workflowId}.");

            $updatedWorkflow = $this->workflowService->updateWorkflow(
                $workflowId,
                $request->validated(),
                Auth::id()
            );

            Log::info("API: Workflow atualizado com sucesso. ID: {$workflowId}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow updated successfully',
                'data' => $updatedWorkflow
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to update this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao atualizar workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar workflow
     */
    public function destroy(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para deletar
            $this->authorize('delete', $workflow);

            Log::info("API: Recebida requisição para deletar workflow ID: {$workflowId}.");

            $result = $this->workflowService->deleteWorkflow($workflowId, Auth::id());

            Log::info("API: Workflow deletado com sucesso. ID: {$workflowId}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow deleted successfully'
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to delete this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao deletar workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ativar workflow
     */
    public function activate(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para atualizar
            $this->authorize('update', $workflow);

            Log::info("API: Recebida requisição para ativar workflow ID: {$workflowId}.");

            $result = $this->workflowService->activateWorkflow($workflowId, Auth::id());

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow cannot be activated'
                ], 400);
            }

            Log::info("API: Workflow ativado com sucesso. ID: {$workflowId}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow activated successfully'
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to activate this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao ativar workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to activate workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Desativar workflow
     */
    public function deactivate(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para atualizar
            $this->authorize('update', $workflow);

            Log::info("API: Recebida requisição para desativar workflow ID: {$workflowId}.");

            $result = $this->workflowService->deactivateWorkflow($workflowId, Auth::id());

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow cannot be deactivated'
                ], 400);
            }

            Log::info("API: Workflow desativado com sucesso. ID: {$workflowId}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow deactivated successfully'
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to deactivate this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao desativar workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to deactivate workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duplicar workflow
     */
    public function duplicate(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para visualizar (para duplicar, precisa ver) e criar
            $this->authorize('view', $workflow);
            $this->authorize('create', Workflow::class);

            Log::info("API: Recebida requisição para duplicar workflow ID: {$workflowId}.");

            $newWorkflow = $this->workflowService->duplicateWorkflow($workflowId, Auth::id());

            if (!$newWorkflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow cannot be duplicated'
                ], 400);
            }

            Log::info("API: Workflow duplicado com sucesso. ID original: {$workflowId}, Novo ID: {$newWorkflow->id}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow duplicated successfully',
                'data' => $newWorkflow
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to duplicate this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao duplicar workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to duplicate workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter definição do canvas
     */
    public function getCanvasDefinition(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para visualizar
            $this->authorize('view', $workflow);

            $definition = $this->canvasService->getCanvasDefinition($workflowId, Auth::id());

            return response()->json([
                'success' => true,
                'data' => $definition
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view this workflow canvas'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter definição do canvas. Workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get canvas definition',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar definição do canvas
     */
    public function updateCanvasDefinition(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->workflowService->getWorkflow($workflowId, Auth::id());

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para salvar definição
            $this->authorize('saveDefinition', $workflow);

            Log::info("API: Recebida requisição para atualizar definição do canvas. Workflow ID: {$workflowId}.");

            $definition = $request->input('definition');

            if (!$definition) {
                return response()->json([
                    'success' => false,
                    'error' => 'Canvas definition is required'
                ], 400);
            }

            $result = $this->canvasService->updateCanvasDefinition(
                $workflowId,
                $definition,
                Auth::id()
            );

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'error' => 'Canvas cannot be updated'
                ], 400);
            }

            Log::info("API: Definição do canvas atualizada com sucesso. Workflow ID: {$workflowId}");

            return response()->json([
                'success' => true,
                'message' => 'Canvas definition updated successfully'
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to update this workflow canvas'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao atualizar definição do canvas. Workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update canvas definition',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validar definição do canvas
     */
    public function validateCanvasDefinition(Request $request): JsonResponse
    {
        try {
            // SECURITY: Apenas usuários autenticados podem validar
            $this->authorize('viewAny', Workflow::class);

            $definition = $request->input('definition');

            if (!$definition) {
                return response()->json([
                    'success' => false,
                    'error' => 'Canvas definition is required'
                ], 400);
            }

            $validation = $this->canvasService->validateCanvasDefinition($definition);

            return response()->json([
                'success' => true,
                'data' => $validation
            ]);
        } catch (\Exception $e) {
            Log::error("API: Erro ao validar definição do canvas. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to validate canvas definition',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
