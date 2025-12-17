<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\AISuperAgentsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AISuperAgentsController extends Controller
{
    protected AISuperAgentsService $aiSuperAgentsService;

    public function __construct(AISuperAgentsService $aiSuperAgentsService)
    {
        $this->aiSuperAgentsService = $aiSuperAgentsService;
    }

    /**
     * Get all AI agents for the authenticated user
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only([
                'type', 'status', 'is_premium', 'is_active',
                'sort_by', 'sort_order', 'per_page'
            ]);

            $agents = $this->aiSuperAgentsService->getAgents($userId, $filters);

            return response()->json([
                'success' => true,
                'data' => $agents,
                'message' => 'AI agents retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve AI agents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific AI agent with details
     */
    public function apiShow(int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);

            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $agent,
                'message' => 'AI agent retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new AI agent
     */
    public function apiCreate(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'type' => 'required|string|in:marketing,sales,analytics,security,support,content',
                'description' => 'nullable|string|max:1000',
                'capabilities' => 'nullable|array',
                'configuration' => 'nullable|array',
                'is_premium' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $data = $request->all();

            // Set default capabilities based on type
            if (!isset($data['capabilities'])) {
                $data['capabilities'] = $this->aiSuperAgentsService->getAgentCapabilities($data['type']);
            }

            $agent = $this->aiSuperAgentsService->createAgent($userId, $data);

            return response()->json([
                'success' => true,
                'data' => $agent,
                'message' => 'AI agent created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an AI agent
     */
    public function apiUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string|max:1000',
                'capabilities' => 'nullable|array',
                'configuration' => 'nullable|array',
                'is_premium' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $success = $this->aiSuperAgentsService->updateAgent($id, $request->all());

            if ($success) {
                $updatedAgent = $this->aiSuperAgentsService->getAgent($id);
                return response()->json([
                    'success' => true,
                    'data' => $updatedAgent,
                    'message' => 'AI agent updated successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update AI agent'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an AI agent
     */
    public function apiDelete(int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $success = $this->aiSuperAgentsService->deleteAgent($id);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'AI agent deleted successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete AI agent'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start an AI agent
     */
    public function apiStart(int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $result = $this->aiSuperAgentsService->startAgent($id);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['agent'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Stop an AI agent
     */
    public function apiStop(int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $result = $this->aiSuperAgentsService->stopAgent($id);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['agent'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to stop AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restart an AI agent
     */
    public function apiRestart(int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $result = $this->aiSuperAgentsService->restartAgent($id);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['agent'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restart AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Configure an AI agent
     */
    public function apiConfigure(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'configuration' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $result = $this->aiSuperAgentsService->configureAgent($id, $request->input('configuration'));

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['agent'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to configure AI agent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get AI agent metrics
     */
    public function apiMetrics(int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $metrics = $this->aiSuperAgentsService->getAgentMetrics($id);

            return response()->json([
                'success' => true,
                'data' => $metrics,
                'message' => 'AI agent metrics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve AI agent metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get AI agent performance data
     */
    public function apiPerformance(Request $request, int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $days = $request->input('days', 30);
            $performance = $this->aiSuperAgentsService->getAgentPerformance($id, $days);

            return response()->json([
                'success' => true,
                'data' => $performance,
                'message' => 'AI agent performance retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve AI agent performance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get AI agent tasks
     */
    public function apiTasks(Request $request, int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $filters = $request->only([
                'status', 'task_type', 'success', 'priority',
                'sort_by', 'sort_order', 'per_page'
            ]);

            $tasks = $this->aiSuperAgentsService->getAgentTasks($id, $filters);

            return response()->json([
                'success' => true,
                'data' => $tasks,
                'message' => 'AI agent tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve AI agent tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get AI agent logs
     */
    public function apiLogs(Request $request, int $id): JsonResponse
    {
        try {
            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $filters = $request->only(['level', 'hours', 'per_page']);
            $logs = $this->aiSuperAgentsService->getAgentLogs($id, $filters);

            return response()->json([
                'success' => true,
                'data' => $logs,
                'message' => 'AI agent logs retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve AI agent logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new task for an AI agent
     */
    public function apiCreateTask(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'task_type' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'input_data' => 'nullable|array',
                'priority' => 'nullable|string|in:low,medium,high,urgent'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $agent = $this->aiSuperAgentsService->getAgent($id);
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI agent not found'
                ], 404);
            }

            // Check if user owns the agent
            if ($agent->user_id !== (string) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to AI agent'
                ], 403);
            }

            $userId = (string) Auth::id();
            $task = $this->aiSuperAgentsService->createTask($id, $userId, $request->all());

            return response()->json([
                'success' => true,
                'data' => $task,
                'message' => 'Task created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Execute a task
     */
    public function apiExecuteTask(int $taskId): JsonResponse
    {
        try {
            $result = $this->aiSuperAgentsService->executeTask($taskId);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['task'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to execute task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available agent types
     */
    public function apiGetTypes(): JsonResponse
    {
        try {
            $types = $this->aiSuperAgentsService->getAgentTypes();

            return response()->json([
                'success' => true,
                'data' => $types,
                'message' => 'Agent types retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve agent types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get capabilities for a specific agent type
     */
    public function apiGetCapabilities(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'type' => 'required|string|in:marketing,sales,analytics,security,support,content'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $type = $request->input('type');
            $capabilities = $this->aiSuperAgentsService->getAgentCapabilities($type);

            return response()->json([
                'success' => true,
                'data' => $capabilities,
                'message' => 'Agent capabilities retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve agent capabilities',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
