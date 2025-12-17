<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\UniversalConnectorsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Illuminate\Support\Facades\Validator;

class UniversalConnectorsController extends Controller
{
    protected UniversalConnectorsService $connectorsService;

    public function __construct(UniversalConnectorsService $connectorsService)
    {
        $this->connectorsService = $connectorsService;
    }

    /**
     * Get all connectors for the authenticated user
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['type', 'status', 'search']);
            $filters['per_page'] = $request->get('per_page', 15);

            $connectors = $this->connectorsService->getConnectors($userId, $filters);

            return ResponseFacade::json([
                'success' => true,
                'data' => $connectors,
                'message' => 'Connectors retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve connectors',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific connector
     */
    public function apiShow(string $id): JsonResponse
    {
        try {
                    $userId = (string) Auth::id();
            $connector = $this->connectorsService->getConnector($id);

            if (!$connector) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $connector,
                'message' => 'Connector retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve connector',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new connector
     */
    public function apiCreate(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'type' => 'required|string|in:api,webhook,database,file,email,sms,slack,discord,telegram,whatsapp',
                'description' => 'nullable|string|max:1000',
                'configuration' => 'required|array',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

                    $userId = (string) Auth::id();
            $data = $request->all();

            $connector = $this->connectorsService->createConnector($userId, $data);

            return ResponseFacade::json([
                'success' => true,
                'data' => $connector,
                'message' => 'Connector created successfully'
            ], 201);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to create connector',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a connector
     */
    public function apiUpdate(Request $request, string $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string|max:1000',
                'configuration' => 'sometimes|array',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

                    $userId = (string) Auth::id();
            $connector = $this->connectorsService->updateConnector($id, $request->all());

            if (!$connector) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $connector,
                'message' => 'Connector updated successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to update connector',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a connector
     */
    public function apiDelete(string $id): JsonResponse
    {
        try {
                    $userId = (string) Auth::id();
            $deleted = $this->connectorsService->deleteConnector($id);

            if (!$deleted) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'message' => 'Connector deleted successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to delete connector',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test connector connection
     */
    public function apiTest(string $id): JsonResponse
    {
        try {
                    $userId = (string) Auth::id();
            $result = $this->connectorsService->testConnector($id);

            if (!$result) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $result,
                'message' => 'Connection test completed'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Connection test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Connect/disconnect connector
     */
    public function apiConnect(Request $request, string $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|string|in:connect,disconnect'
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

                    $userId = (string) Auth::id();
            $action = $request->input('action');

            if ($action === 'connect') {
                $result = $this->connectorsService->connectConnector($id);
            } else {
                $result = $this->connectorsService->disconnectConnector($id);
            }

            if (!$result) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $result,
                'message' => "Connector {$action}ed successfully"
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => "Failed to {$request->input('action')} connector",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync connector data
     */
    public function apiSync(string $id): JsonResponse
    {
        try {
                    $userId = (string) Auth::id();
            $result = $this->connectorsService->syncConnector($id);

            if (!$result) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $result,
                'message' => 'Data sync completed'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Data sync failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get connector metrics
     */
    public function apiMetrics(string $id): JsonResponse
    {
        try {
                    $userId = (string) Auth::id();
            $metrics = $this->connectorsService->getConnectorMetrics($id);

            if (!$metrics) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $metrics,
                'message' => 'Metrics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get connector logs
     */
    public function apiLogs(Request $request, string $id): JsonResponse
    {
        try {
                    $userId = (string) Auth::id();
            $filters = $request->only(['level', 'start_date', 'end_date']);
            $filters['per_page'] = $request->get('per_page', 15);

            $logs = $this->connectorsService->getConnectorSyncLogs($id, $filters);

            if (!$logs) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Connector not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $logs,
                'message' => 'Logs retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available connector types
     */
    public function apiGetTypes(): JsonResponse
    {
        try {
            $types = $this->connectorsService->getAvailableTypes();

            return ResponseFacade::json([
                'success' => true,
                'data' => $types,
                'message' => 'Connector types retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve connector types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get connector templates
     */
    public function apiGetTemplates(): JsonResponse
    {
        try {
            $templates = $this->connectorsService->getTemplates();

            return ResponseFacade::json([
                'success' => true,
                'data' => $templates,
                'message' => 'Connector templates retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve connector templates',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
