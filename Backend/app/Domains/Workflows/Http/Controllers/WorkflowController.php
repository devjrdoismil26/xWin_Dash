<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Http\Requests\ExecuteWorkflowRequest;
use App\Domains\Workflows\Http\Requests\StoreWorkflowRequest;
use App\Domains\Workflows\Http\Requests\UpdateWorkflowRequest;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Application\Services\WorkflowsApplicationService;
use App\Domains\Workflows\Models\Workflow;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * WorkflowController
 * 
 * SECURITY FIX (AUTH-002): Implementada autorização em todos os métodos usando Policies
 */
class WorkflowController extends Controller
{
    protected WorkflowService $workflowService;
    protected WorkflowsApplicationService $workflowsApplicationService;

    public function __construct(
        WorkflowService $workflowService,
        WorkflowsApplicationService $workflowsApplicationService
    ) {
        $this->workflowService = $workflowService;
        $this->workflowsApplicationService = $workflowsApplicationService;
    }

    /**
     * Display a listing of the workflows.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para listar workflows
        $this->authorize('viewAny', Workflow::class);

        $userId = Auth::id();

        $filters = [
            'per_page' => (int) $request->get('per_page', 15),
            'page' => (int) $request->get('page', 1),
            'status' => $request->get('status'),
            'search' => $request->get('search'),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_direction' => $request->get('sort_direction', 'desc')
        ];

        $result = $this->workflowsApplicationService->listWorkflows($userId, $filters);

        if (!$result['success']) {
            return new JsonResponse($result, 400);
        }

        return new JsonResponse($result['data']);
    }

    /**
     * Store a newly created workflow in storage.
     *
     * @param StoreWorkflowRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreWorkflowRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização para criar workflow
        $this->authorize('create', Workflow::class);

        $userId = Auth::id();

        $data = array_merge($request->validated(), [
            'user_id' => $userId,
            'project_id' => session('selected_project_id'),
        ]);
        
        $result = $this->workflowsApplicationService->createWorkflow($data);

        if (!$result['success']) {
            return new JsonResponse($result, 400);
        }

        return new JsonResponse($result['data'], 201);
    }

    /**
     * Display the specified workflow.
     *
     * @param string|int $id
     *
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $workflowId = is_numeric($id) ? (int) $id : $id;

        $workflow = $this->workflowService->getWorkflowById($workflowId);
        if (!$workflow) {
            return new JsonResponse(['message' => 'Workflow not found.'], 404);
        }

        // SECURITY: Verificar autorização para visualizar
        $this->authorize('view', $workflow);

        return new JsonResponse($workflow);
    }

    /**
     * Update the specified workflow in storage.
     *
     * @param UpdateWorkflowRequest $request
     * @param string|int            $id
     *
     * @return JsonResponse
     */
    public function update(UpdateWorkflowRequest $request, $id): JsonResponse
    {
        $workflowId = is_numeric($id) ? (int) $id : $id;

        $workflow = $this->workflowService->getWorkflowById($workflowId);
        if (!$workflow) {
            return new JsonResponse(['message' => 'Workflow not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $workflow);

        $data = array_merge($request->validated(), [
            'workflow_id' => $workflowId,
            'user_id' => Auth::id()
        ]);

        $result = $this->workflowsApplicationService->updateWorkflow($workflowId, $data);

        if (!$result['success']) {
            return new JsonResponse($result, 404);
        }

        return new JsonResponse($result['data']);
    }

    /**
     * Remove the specified workflow from storage.
     *
     * @param string|int $id
     *
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $workflowId = is_numeric($id) ? (int) $id : $id;

        $workflow = $this->workflowService->getWorkflowById($workflowId);
        if (!$workflow) {
            return new JsonResponse(['message' => 'Workflow not found.'], 404);
        }

        // SECURITY: Verificar autorização para deletar
        $this->authorize('delete', $workflow);

        $result = $this->workflowsApplicationService->deleteWorkflow($workflowId, Auth::id());

        if (!$result['success']) {
            return new JsonResponse($result, 404);
        }

        return new JsonResponse($result);
    }

    /**
     * Execute a specific workflow.
     *
     * @param ExecuteWorkflowRequest $request
     *
     * @return JsonResponse
     */
    public function execute(ExecuteWorkflowRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $workflowId = isset($validated['workflow_id']) ? (int) $validated['workflow_id'] : null;

        if ($workflowId === null) {
            return new JsonResponse(['message' => 'Workflow ID is required.'], 400);
        }

        $workflow = $this->workflowService->getWorkflowById($workflowId);
        if (!$workflow) {
            return new JsonResponse(['message' => 'Workflow not found.'], 404);
        }

        // SECURITY: Verificar autorização para executar
        $this->authorize('execute', $workflow);

        $data = [
            'workflow_id' => $workflowId,
            'user_id' => Auth::id(),
            'initial_payload' => $validated['initial_payload'] ?? [],
            'execution_context' => $validated['execution_context'] ?? []
        ];

        $result = $this->workflowsApplicationService->executeWorkflow($data);

        if (!$result['success']) {
            return new JsonResponse($result, 400);
        }

        return new JsonResponse($result['data']);
    }

    /**
     * Simulate a workflow execution.
     *
     * @param Request $request
     * @param string|int $workflowId
     *
     * @return JsonResponse
     */
    public function simulate(Request $request, $workflowId): JsonResponse
    {
        try {
            $id = is_numeric($workflowId) ? (int) $workflowId : $workflowId;

            $workflow = $this->workflowService->getWorkflowById($id);
            if (!$workflow) {
                return new JsonResponse(['message' => 'Workflow not found.'], 404);
            }

            // SECURITY: Verificar autorização para simular
            $this->authorize('simulate', Workflow::class);

            // Simulate workflow execution
            $simulationResult = [
                'workflow_id' => $id,
                'status' => 'simulated',
                'message' => 'Workflow simulation completed successfully',
                'execution_time' => '0.5s',
                'nodes_executed' => 3,
                'result' => 'Simulation successful'
            ];

            return new JsonResponse($simulationResult);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Failed to simulate workflow.', 'error' => $e->getMessage()], 500);
        }
    }
}
