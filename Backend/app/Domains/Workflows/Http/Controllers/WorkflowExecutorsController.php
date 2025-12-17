<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\WorkflowExecutorsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkflowExecutorsController extends Controller
{
    protected WorkflowExecutorsService $workflowExecutorsService;

    public function __construct(WorkflowExecutorsService $workflowExecutorsService)
    {
        $this->workflowExecutorsService = $workflowExecutorsService;
    }

    /**
     * Execute node
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function execute(Request $request): JsonResponse
    {
        $data = $request->validate([
            'node_id' => 'required|string',
            'workflow_id' => 'required|integer',
            'input_data' => 'required|array',
            'context' => 'sometimes|array',
        ]);

        $result = $this->workflowExecutorsService->executeNode($data);
        return response()->json(['data' => $result]);
    }

    /**
     * Test node
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function test(Request $request): JsonResponse
    {
        $data = $request->validate([
            'node_type' => 'required|string',
            'configuration' => 'required|array',
            'test_data' => 'required|array',
        ]);

        $result = $this->workflowExecutorsService->testNode($data);
        return response()->json(['data' => $result]);
    }

    /**
     * Get executors by category
     *
     * @param string $category
     * @param Request $request
     * @return JsonResponse
     */
    public function getByCategory(string $category, Request $request): JsonResponse
    {
        $executors = $this->workflowExecutorsService->getExecutorsByCategory($category, $request->all());
        return response()->json(['data' => $executors]);
    }

    /**
     * Get executor schema
     *
     * @param string $type
     * @return JsonResponse
     */
    public function getSchema(string $type): JsonResponse
    {
        $schema = $this->workflowExecutorsService->getExecutorSchema($type);
        if (!$schema) {
            return response()->json(['message' => 'Executor type not found.'], 404);
        }
        return response()->json(['data' => $schema]);
    }

    /**
     * Validate executor configuration
     *
     * @param string $type
     * @param Request $request
     * @return JsonResponse
     */
    public function validateConfiguration(string $type, Request $request): JsonResponse
    {
        $data = $request->validate([
            'configuration' => 'required|array',
        ]);

        $result = $this->workflowExecutorsService->validateConfiguration($type, $data['configuration']);
        return response()->json(['data' => $result]);
    }

    /**
     * Get executor metadata
     *
     * @param string $type
     * @return JsonResponse
     */
    public function getMetadata(string $type): JsonResponse
    {
        $metadata = $this->workflowExecutorsService->getExecutorMetadata($type);
        if (!$metadata) {
            return response()->json(['message' => 'Executor type not found.'], 404);
        }
        return response()->json(['data' => $metadata]);
    }

    /**
     * Get executors statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStatistics(Request $request): JsonResponse
    {
        $statistics = $this->workflowExecutorsService->getExecutorsStatistics($request->all());
        return response()->json(['data' => $statistics]);
    }

    /**
     * Get executor health
     *
     * @param string $type
     * @return JsonResponse
     */
    public function getHealth(string $type): JsonResponse
    {
        $health = $this->workflowExecutorsService->getExecutorHealth($type);
        if (!$health) {
            return response()->json(['message' => 'Executor type not found.'], 404);
        }
        return response()->json(['data' => $health]);
    }

    /**
     * Get executor dependencies
     *
     * @param string $type
     * @return JsonResponse
     */
    public function getDependencies(string $type): JsonResponse
    {
        $dependencies = $this->workflowExecutorsService->getExecutorDependencies($type);
        if (!$dependencies) {
            return response()->json(['message' => 'Executor type not found.'], 404);
        }
        return response()->json(['data' => $dependencies]);
    }

    /**
     * Get executor capabilities
     *
     * @param string $type
     * @return JsonResponse
     */
    public function getCapabilities(string $type): JsonResponse
    {
        $capabilities = $this->workflowExecutorsService->getExecutorCapabilities($type);
        if (!$capabilities) {
            return response()->json(['message' => 'Executor type not found.'], 404);
        }
        return response()->json(['data' => $capabilities]);
    }
}
