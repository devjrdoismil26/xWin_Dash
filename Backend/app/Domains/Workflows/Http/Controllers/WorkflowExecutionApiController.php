<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Http\Requests\ExecuteWorkflowRequest;
use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Domains\Workflows\Services\WorkflowValidationService;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Models\WorkflowExecution;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Workflow Execution API Controller
 *
 * Controller especializado para operações de execução de workflows
 * Responsável por gerenciar execuções via API
 * 
 * SECURITY FIX (AUTH-002): Implementada autorização em todos os métodos
 */
class WorkflowExecutionApiController extends Controller
{
    private ?WorkflowService $workflowService = null;

    public function __construct(
        private WorkflowExecutionService $executionService,
        private WorkflowValidationService $validationService
    ) {
    }

    /**
     * Set workflow service (injetado via WorkflowApiController)
     */
    public function setWorkflowService(WorkflowService $workflowService): void
    {
        $this->workflowService = $workflowService;
    }

    /**
     * Get workflow by ID (helper method)
     */
    private function getWorkflow(int $workflowId): ?Workflow
    {
        if ($this->workflowService) {
            return $this->workflowService->getWorkflowById($workflowId);
        }
        return Workflow::find($workflowId);
    }

    /**
     * Disparar execução de workflow via API
     */
    public function trigger(ExecuteWorkflowRequest $request): JsonResponse
    {
        try {
            $workflow = $this->getWorkflow($request->workflow_id);

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para executar
            $this->authorize('execute', $workflow);

            Log::info("API: Recebida requisição para disparar workflow ID: {$request->workflow_id}.");

            // Validar workflow
            $validation = $this->validationService->validateWorkflow(
                $request->workflow_id,
                $request->payload ?? [],
                ['user_id' => Auth::id()]
            );

            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow validation failed',
                    'validation_errors' => $validation['errors']
                ], 400);
            }

            // Executar workflow
            $result = $this->executionService->executeWorkflow(
                $request->workflow_id,
                $request->payload ?? [],
                [
                    'user_id' => Auth::id(),
                    'project_id' => session('selected_project_id'),
                    'trigger_type' => 'api',
                    'trigger_data' => $request->all()
                ]
            );

            Log::info("API: Workflow executado com sucesso. ID: {$request->workflow_id}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow executed successfully',
                'data' => $result
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to execute this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao executar workflow ID: {$request->workflow_id}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to execute workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Executar workflow de forma assíncrona
     */
    public function triggerAsync(ExecuteWorkflowRequest $request): JsonResponse
    {
        try {
            $workflow = $this->getWorkflow($request->workflow_id);

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para executar
            $this->authorize('execute', $workflow);

            Log::info("API: Recebida requisição para disparar workflow assíncrono ID: {$request->workflow_id}.");

            // Validar workflow
            $validation = $this->validationService->validateWorkflow(
                $request->workflow_id,
                $request->payload ?? [],
                ['user_id' => Auth::id()]
            );

            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow validation failed',
                    'validation_errors' => $validation['errors']
                ], 400);
            }

            // Executar workflow de forma assíncrona
            $jobId = $this->executionService->executeWorkflowAsync(
                $request->workflow_id,
                $request->payload ?? [],
                [
                    'user_id' => Auth::id(),
                    'project_id' => session('selected_project_id'),
                    'trigger_type' => 'api_async',
                    'trigger_data' => $request->all()
                ]
            );

            Log::info("API: Workflow assíncrono enfileirado. ID: {$request->workflow_id}, Job ID: {$jobId}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow queued for execution',
                'job_id' => $jobId
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to execute this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao enfileirar workflow ID: {$request->workflow_id}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to queue workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter status de execução
     */
    public function getExecutionStatus(Request $request, int $executionId): JsonResponse
    {
        try {
            $execution = WorkflowExecution::find($executionId);

            if (!$execution) {
                return response()->json([
                    'success' => false,
                    'error' => 'Execution not found'
                ], 404);
            }

            // SECURITY: Verificar se o usuário tem acesso ao workflow desta execução
            $workflow = $this->getWorkflow($execution->workflow_id);
            if ($workflow) {
                $this->authorize('view', $workflow);
            }

            $status = $this->executionService->getExecutionStatus($executionId);

            return response()->json([
                'success' => true,
                'data' => $status
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view this execution'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter status de execução ID: {$executionId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get execution status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancelar execução
     */
    public function cancelExecution(Request $request, int $executionId): JsonResponse
    {
        try {
            $execution = WorkflowExecution::find($executionId);

            if (!$execution) {
                return response()->json([
                    'success' => false,
                    'error' => 'Execution not found'
                ], 404);
            }

            // SECURITY: Verificar se o usuário tem acesso ao workflow desta execução
            $workflow = $this->getWorkflow($execution->workflow_id);
            if ($workflow) {
                $this->authorize('execute', $workflow);
            }

            $result = $this->executionService->cancelExecution($executionId);

            if ($result) {
                Log::info("API: Execução cancelada. ID: {$executionId}");

                return response()->json([
                    'success' => true,
                    'message' => 'Execution cancelled successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to cancel execution'
                ], 400);
            }
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to cancel this execution'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao cancelar execução ID: {$executionId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to cancel execution',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter histórico de execuções
     */
    public function getExecutionHistory(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->getWorkflow($workflowId);

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para visualizar
            $this->authorize('view', $workflow);

            $limit = $request->get('limit', 50);
            $history = $this->executionService->getExecutionHistory($workflowId, $limit);

            return response()->json([
                'success' => true,
                'data' => $history
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view this workflow history'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter histórico de execuções. Workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get execution history',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de execução
     */
    public function getExecutionStats(Request $request, int $workflowId): JsonResponse
    {
        try {
            $workflow = $this->getWorkflow($workflowId);

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para visualizar
            $this->authorize('view', $workflow);

            $stats = $this->executionService->getExecutionStats($workflowId);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view this workflow stats'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter estatísticas de execução. Workflow ID: {$workflowId}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get execution stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Testar workflow
     */
    public function testWorkflow(ExecuteWorkflowRequest $request): JsonResponse
    {
        try {
            $workflow = $this->getWorkflow($request->workflow_id);

            if (!$workflow) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow not found'
                ], 404);
            }

            // SECURITY: Verificar autorização para executar
            $this->authorize('execute', $workflow);

            Log::info("API: Recebida requisição para testar workflow ID: {$request->workflow_id}.");

            // Validar workflow
            $validation = $this->validationService->validateWorkflow(
                $request->workflow_id,
                $request->payload ?? [],
                ['user_id' => Auth::id()]
            );

            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'error' => 'Workflow validation failed',
                    'validation_errors' => $validation['errors']
                ], 400);
            }

            // Executar teste (modo dry-run)
            $result = $this->executionService->testWorkflow(
                $request->workflow_id,
                $request->payload ?? [],
                [
                    'user_id' => Auth::id(),
                    'project_id' => session('selected_project_id'),
                    'trigger_type' => 'test',
                    'trigger_data' => $request->all()
                ]
            );

            Log::info("API: Teste de workflow executado. ID: {$request->workflow_id}");

            return response()->json([
                'success' => true,
                'message' => 'Workflow test completed',
                'data' => $result
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to test this workflow'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao testar workflow ID: {$request->workflow_id}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to test workflow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter execuções em andamento
     */
    public function getRunningExecutions(Request $request): JsonResponse
    {
        try {
            // SECURITY: Verificar autorização para listar workflows
            $this->authorize('viewAny', Workflow::class);

            $executions = $this->executionService->getRunningExecutions(Auth::id());

            return response()->json([
                'success' => true,
                'data' => $executions
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view executions'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter execuções em andamento. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get running executions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter execuções recentes
     */
    public function getRecentExecutions(Request $request): JsonResponse
    {
        try {
            // SECURITY: Verificar autorização para listar workflows
            $this->authorize('viewAny', Workflow::class);

            $limit = $request->get('limit', 20);
            $executions = $this->executionService->getRecentExecutions(Auth::id(), $limit);

            return response()->json([
                'success' => true,
                'data' => $executions
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You do not have permission to view executions'
            ], 403);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter execuções recentes. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get recent executions',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
