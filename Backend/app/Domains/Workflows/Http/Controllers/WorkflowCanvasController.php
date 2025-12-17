<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\WorkflowCanvasService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Supondo que este serviço exista

class WorkflowCanvasController extends Controller
{
    protected WorkflowCanvasService $canvasService;

    public function __construct(WorkflowCanvasService $canvasService)
    {
        $this->canvasService = $canvasService;
    }

    /**
     * Get the workflow canvas definition.
     *
     * @param int $workflowId
     *
     * @return JsonResponse
     */
    public function show(int $workflowId): JsonResponse
    {
        try {
            $canvasDefinition = $this->canvasService->getCanvasDefinition($workflowId);
            return new JsonResponse($canvasDefinition);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Failed to retrieve canvas definition.', 'error' => $e->getMessage()], 404);
        }
    }

    /**
     * Save the workflow canvas definition.
     *
     * @param int     $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function save(int $workflowId, Request $request): JsonResponse
    {
        $request->validate([
            'nodes' => 'required|array',
            'edges' => 'required|array',
        ]);

        try {
            $nodes = $request->input('nodes', []);
            $edges = $request->input('edges', []);
            $workflow = $this->canvasService->saveCanvasDefinition($workflowId, $nodes, $edges);
            return new JsonResponse(['message' => 'Canvas definition saved successfully.', 'workflow' => $workflow]);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Failed to save canvas definition.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get canvas statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function statistics(Request $request): JsonResponse
    {
        $statistics = $this->canvasService->getCanvasStatistics($request->all());
        return response()->json(['data' => $statistics]);
    }

    /**
     * Auto-organize canvas
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function autoOrganize(int $workflowId, Request $request): JsonResponse
    {
        $result = $this->canvasService->autoOrganizeCanvas($workflowId, $request->all());
        if (!$result) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Canvas auto-organized successfully.']);
    }

    /**
     * Align nodes
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function align(int $workflowId, Request $request): JsonResponse
    {
        $data = $request->validate([
            'node_ids' => 'required|array',
            'alignment' => 'required|string|in:left,right,top,bottom,center',
        ]);

        $result = $this->canvasService->alignNodes($workflowId, $data);
        if (!$result) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Nodes aligned successfully.']);
    }

    /**
     * Optimize canvas layout
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function optimize(int $workflowId, Request $request): JsonResponse
    {
        $result = $this->canvasService->optimizeCanvasLayout($workflowId, $request->all());
        if (!$result) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Canvas layout optimized successfully.']);
    }

    /**
     * Analyze canvas
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function analyze(int $workflowId, Request $request): JsonResponse
    {
        $analysis = $this->canvasService->analyzeCanvas($workflowId, $request->all());
        if (!$analysis) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $analysis]);
    }

    /**
     * Export canvas configuration
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function export(int $workflowId, Request $request): JsonResponse
    {
        $export = $this->canvasService->exportCanvasConfiguration($workflowId, $request->all());
        if (!$export) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $export]);
    }

    /**
     * Import canvas configuration
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function import(int $workflowId, Request $request): JsonResponse
    {
        $data = $request->validate([
            'configuration' => 'required|array',
            'merge_mode' => 'sometimes|string|in:replace,merge',
        ]);

        $result = $this->canvasService->importCanvasConfiguration($workflowId, $data);
        if (!$result) {
            return response()->json(['message' => 'Workflow not found or import failed.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Canvas configuration imported successfully.']);
    }

    /**
     * Get canvas preview
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function preview(int $workflowId, Request $request): JsonResponse
    {
        $preview = $this->canvasService->getCanvasPreview($workflowId, $request->all());
        if (!$preview) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $preview]);
    }
}
