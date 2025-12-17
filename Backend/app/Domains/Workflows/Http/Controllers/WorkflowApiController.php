<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Http\Requests\ExecuteWorkflowRequest;
use App\Domains\Workflows\Http\Requests\StoreWorkflowRequest;
use App\Domains\Workflows\Http\Requests\UpdateWorkflowRequest;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Services\WorkflowCanvasService;
use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Domains\Workflows\Services\WorkflowValidationService;
use App\Domains\Workflows\Services\WorkflowMetricsService;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * 🔄 Workflow API Controller
 *
 * Controller principal para APIs de workflows
 * Orquestra os controllers especializados de execução e gerenciamento
 */
class WorkflowApiController extends Controller
{
    private WorkflowExecutionApiController $executionController;
    private WorkflowManagementApiController $managementController;

    public function __construct(
        WorkflowService $workflowService,
        WorkflowCanvasService $canvasService,
        WorkflowExecutionService $executionService,
        WorkflowValidationService $validationService,
        WorkflowMetricsService $metricsService
    ) {
        $this->executionController = new WorkflowExecutionApiController(
            $executionService,
            $validationService
        );

        $this->managementController = new WorkflowManagementApiController(
            $workflowService,
            $canvasService
        );
    }

    // ============================================================================
    // EXECUTION ENDPOINTS
    // ============================================================================

    /**
     * Disparar execução de workflow via API
     */
    public function trigger(ExecuteWorkflowRequest $request): JsonResponse
    {
        return $this->executionController->trigger($request);
    }

    /**
     * Executar workflow de forma assíncrona
     */
    public function triggerAsync(ExecuteWorkflowRequest $request): JsonResponse
    {
        return $this->executionController->triggerAsync($request);
    }

    /**
     * Obter status de execução
     */
    public function getExecutionStatus(Request $request, int $executionId): JsonResponse
    {
        return $this->executionController->getExecutionStatus($request, $executionId);
    }

    /**
     * Cancelar execução
     */
    public function cancelExecution(Request $request, int $executionId): JsonResponse
    {
        return $this->executionController->cancelExecution($request, $executionId);
    }

    /**
     * Obter histórico de execuções
     */
    public function getExecutionHistory(Request $request, int $workflowId): JsonResponse
    {
        return $this->executionController->getExecutionHistory($request, $workflowId);
    }

    /**
     * Obter estatísticas de execução
     */
    public function getExecutionStats(Request $request, int $workflowId): JsonResponse
    {
        return $this->executionController->getExecutionStats($request, $workflowId);
    }

    /**
     * Testar workflow
     */
    public function testWorkflow(ExecuteWorkflowRequest $request): JsonResponse
    {
        return $this->executionController->testWorkflow($request);
    }

    /**
     * Obter execuções em andamento
     */
    public function getRunningExecutions(Request $request): JsonResponse
    {
        return $this->executionController->getRunningExecutions($request);
    }

    /**
     * Obter execuções recentes
     */
    public function getRecentExecutions(Request $request): JsonResponse
    {
        return $this->executionController->getRecentExecutions($request);
    }

    // ============================================================================
    // MANAGEMENT ENDPOINTS
    // ============================================================================

    /**
     * Listar workflows
     */
    public function index(Request $request): JsonResponse
    {
        return $this->managementController->index($request);
    }

    /**
     * Criar workflow
     */
    public function store(StoreWorkflowRequest $request): JsonResponse
    {
        return $this->managementController->store($request);
    }

    /**
     * Obter workflow específico
     */
    public function show(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->show($request, $workflowId);
    }

    /**
     * Atualizar workflow
     */
    public function update(UpdateWorkflowRequest $request, int $workflowId): JsonResponse
    {
        return $this->managementController->update($request, $workflowId);
    }

    /**
     * Deletar workflow
     */
    public function destroy(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->destroy($request, $workflowId);
    }

    /**
     * Ativar workflow
     */
    public function activate(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->activate($request, $workflowId);
    }

    /**
     * Desativar workflow
     */
    public function deactivate(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->deactivate($request, $workflowId);
    }

    /**
     * Duplicar workflow
     */
    public function duplicate(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->duplicate($request, $workflowId);
    }

    /**
     * Obter definição do canvas
     */
    public function getCanvasDefinition(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->getCanvasDefinition($request, $workflowId);
    }

    /**
     * Atualizar definição do canvas
     */
    public function updateCanvasDefinition(Request $request, int $workflowId): JsonResponse
    {
        return $this->managementController->updateCanvasDefinition($request, $workflowId);
    }

    /**
     * Validar definição do canvas
     */
    public function validateCanvasDefinition(Request $request): JsonResponse
    {
        return $this->managementController->validateCanvasDefinition($request);
    }

    // ============================================================================
    // UTILITY ENDPOINTS
    // ============================================================================

    /**
     * IMPL-006: Implementação real de estatísticas gerais
     */
    public function getGeneralStats(Request $request): JsonResponse
    {
        try {
            $projectId = session('selected_project_id');
            $userId = Auth::id();

            // SECURITY: Filtrar por projeto
            $workflowsQuery = WorkflowModel::where('user_id', $userId);
            if ($projectId) {
                $workflowsQuery->where('project_id', $projectId);
            }

            $totalWorkflows = $workflowsQuery->count();
            $activeWorkflows = (clone $workflowsQuery)->where('is_active', true)->count();

            $executionsQuery = WorkflowExecutionModel::whereHas('workflow', function($q) use ($userId, $projectId) {
                $q->where('user_id', $userId);
                if ($projectId) {
                    $q->where('project_id', $projectId);
                }
            });

            $totalExecutions = $executionsQuery->count();
            $successfulExecutions = (clone $executionsQuery)->where('status', 'completed')->count();
            $failedExecutions = (clone $executionsQuery)->where('status', 'failed')->count();

            $stats = [
                'total_workflows' => $totalWorkflows,
                'active_workflows' => $activeWorkflows,
                'inactive_workflows' => $totalWorkflows - $activeWorkflows,
                'total_executions' => $totalExecutions,
                'successful_executions' => $successfulExecutions,
                'failed_executions' => $failedExecutions,
                'overall_success_rate' => $totalExecutions > 0 ? round(($successfulExecutions / $totalExecutions) * 100, 2) : 0,
                'overall_failure_rate' => $totalExecutions > 0 ? round(($failedExecutions / $totalExecutions) * 100, 2) : 0
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter estatísticas gerais. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get general stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * IMPL-006: Implementação real de workflows por tipo
     */
    public function getWorkflowsByType(Request $request, string $type): JsonResponse
    {
        try {
            $projectId = session('selected_project_id');
            $userId = Auth::id();

            // SECURITY: Filtrar por projeto e tipo
            $query = WorkflowModel::where('user_id', $userId)
                ->where('type', $type);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }

            $workflows = $query->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20)
                ->map(function($workflow) {
                    return [
                        'id' => $workflow->id,
                        'name' => $workflow->name,
                        'type' => $workflow->type,
                        'status' => $workflow->status,
                        'is_active' => $workflow->is_active,
                        'created_at' => $workflow->created_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $workflows
            ]);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter workflows por tipo. Tipo: {$type}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get workflows by type',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * IMPL-006: Implementação real de workflows por prioridade
     */
    public function getWorkflowsByPriority(Request $request, string $priority): JsonResponse
    {
        try {
            $projectId = session('selected_project_id');
            $userId = Auth::id();

            // SECURITY: Filtrar por projeto e prioridade
            $query = WorkflowModel::where('user_id', $userId)
                ->where('priority', $priority);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }

            $workflows = $query->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20)
                ->map(function($workflow) {
                    return [
                        'id' => $workflow->id,
                        'name' => $workflow->name,
                        'priority' => $workflow->priority,
                        'status' => $workflow->status,
                        'is_active' => $workflow->is_active,
                        'created_at' => $workflow->created_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $workflows
            ]);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter workflows por prioridade. Prioridade: {$priority}. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get workflows by priority',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * IMPL-006: Implementação real de workflows ativos
     */
    public function getActiveWorkflows(Request $request): JsonResponse
    {
        try {
            $projectId = session('selected_project_id');
            $userId = Auth::id();

            // SECURITY: Filtrar por projeto e status ativo
            $query = WorkflowModel::where('user_id', $userId)
                ->where('is_active', true);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }

            $workflows = $query->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20)
                ->map(function($workflow) {
                    return [
                        'id' => $workflow->id,
                        'name' => $workflow->name,
                        'type' => $workflow->type,
                        'priority' => $workflow->priority,
                        'status' => $workflow->status,
                        'executions_count' => $workflow->executions()->count(),
                        'last_execution_at' => $workflow->executions()->latest()->first()?->created_at?->toISOString(),
                        'created_at' => $workflow->created_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $workflows
            ]);
        } catch (\Exception $e) {
            Log::error("API: Erro ao obter workflows ativos. Erro: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get active workflows',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
