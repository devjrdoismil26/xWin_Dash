<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\WorkflowDragDropService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Supondo que este serviço exista

class WorkflowDragDropController extends Controller
{
    protected WorkflowDragDropService $dragDropService;

    public function __construct(WorkflowDragDropService $dragDropService)
    {
        $this->dragDropService = $dragDropService;
    }

    /**
     * Update the position of a workflow node.
     *
     * @param int     $workflowId
     * @param int     $nodeId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateNodePosition(int $workflowId, int $nodeId, Request $request): JsonResponse
    {
        $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
        ]);

        try {
            $x = $request->input('x');
            $y = $request->input('y');
            $canvasDefinition = []; // This should come from the workflow
            $node = $this->dragDropService->updateNodePosition($canvasDefinition, (string)$nodeId, $x, $y);
            return new JsonResponse(['message' => 'Node position updated successfully.', 'node' => $node]);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Failed to update node position.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Connect two workflow nodes.
     *
     * @param int     $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function connectNodes(int $workflowId, Request $request): JsonResponse
    {
        $request->validate([
            'source_node_id' => 'required|integer|exists:workflow_nodes,id',
            'target_node_id' => 'required|integer|exists:workflow_nodes,id',
            'connection_type' => 'required|string|in:next,true,false',
        ]);

        try {
            $canvasDefinition = []; // This should come from the workflow
            $sourceNodeId = $request->input('source_node_id');
            $targetNodeId = $request->input('target_node_id');
            $connectionType = $request->input('connection_type');
            $workflow = $this->dragDropService->connectNodes($canvasDefinition, $sourceNodeId, $targetNodeId, $connectionType);
            return new JsonResponse(['message' => 'Nodes connected successfully.', 'workflow' => $workflow]);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Failed to connect nodes.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Disconnect two workflow nodes.
     *
     * @param int     $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function disconnectNodes(int $workflowId, Request $request): JsonResponse
    {
        $request->validate([
            'source_node_id' => 'required|integer|exists:workflow_nodes,id',
            'target_node_id' => 'required|integer|exists:workflow_nodes,id',
            'connection_type' => 'required|string|in:next,true,false',
        ]);

        try {
            $canvasDefinition = []; // This should come from the workflow
            $sourceNodeId = $request->input('source_node_id');
            $targetNodeId = $request->input('target_node_id');
            $connectionType = $request->input('connection_type');
            $workflow = $this->dragDropService->disconnectNodes($canvasDefinition, $sourceNodeId, $targetNodeId, $connectionType);
            return new JsonResponse(['message' => 'Nodes disconnected successfully.', 'workflow' => $workflow]);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Failed to disconnect nodes.', 'error' => $e->getMessage()], 500);
        }
    }
}
