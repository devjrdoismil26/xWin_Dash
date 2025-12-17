<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\ProjectWorkflowIsolationService;
use App\Domains\Workflows\Services\WorkflowService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse; // Supondo que este serviço exista
use Illuminate\Http\Request;

// Supondo que este serviço exista

class ProjectWorkflowController extends Controller
{
    protected WorkflowService $workflowService;

    protected ProjectWorkflowIsolationService $isolationService;

    public function __construct(WorkflowService $workflowService, ProjectWorkflowIsolationService $isolationService)
    {
        $this->workflowService = $workflowService;
        $this->isolationService = $isolationService;
    }

    /**
     * Display a listing of workflows for a specific project.
     *
     * @param int     $projectId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(int $projectId, Request $request): JsonResponse
    {
        $workflows = $this->isolationService->getProjectWorkflows($projectId, $request->get('per_page', 15));
        return response()->json($workflows);
    }

    /**
     * Store a newly created workflow for a project.
     *
     * @param int     $projectId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(int $projectId, Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:draft,active,paused',
            'definition' => 'required|array',
        ]);

        try {
            $workflow = $this->isolationService->createProjectWorkflow($projectId, auth()->id(), $request->validated());
            return response()->json($workflow, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified workflow for a project.
     *
     * @param int $projectId
     * @param int $workflowId
     *
     * @return JsonResponse
     */
    public function show(int $projectId, int $workflowId): JsonResponse
    {
        $workflow = $this->isolationService->getProjectWorkflowById($projectId, $workflowId);
        if (!$workflow) {
            return response()->json(['message' => 'Workflow not found for this project.'], 404);
        }
        return response()->json($workflow);
    }

    /**
     * Update the specified workflow for a project.
     *
     * @param int     $projectId
     * @param int     $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function update(int $projectId, int $workflowId, Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:draft,active,paused,completed,failed',
            'definition' => 'sometimes|required|array',
        ]);

        try {
            $workflow = $this->isolationService->updateProjectWorkflow($projectId, $workflowId, $request->validated());
            if (!$workflow) {
                return response()->json(['message' => 'Workflow not found for this project.'], 404);
            }
            return response()->json($workflow);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified workflow from a project.
     *
     * @param int $projectId
     * @param int $workflowId
     *
     * @return JsonResponse
     */
    public function destroy(int $projectId, int $workflowId): JsonResponse
    {
        $success = $this->isolationService->deleteProjectWorkflow($projectId, $workflowId);
        if (!$success) {
            return response()->json(['message' => 'Workflow not found for this project.'], 404);
        }
        return response()->json(['message' => 'Workflow deleted successfully from project.']);
    }
}
