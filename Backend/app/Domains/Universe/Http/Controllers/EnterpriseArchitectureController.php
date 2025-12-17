<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\EnterpriseArchitectureService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Illuminate\Support\Facades\Validator;

class EnterpriseArchitectureController extends Controller
{
    protected EnterpriseArchitectureService $enterpriseService;

    public function __construct(EnterpriseArchitectureService $enterpriseService)
    {
        $this->enterpriseService = $enterpriseService;
    }

    /**
     * Get all tenants for the authenticated user
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['status', 'plan_type', 'search']);
            $perPage = $request->get('per_page', 15);

            $tenants = $this->enterpriseService->getTenants($userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $tenants,
                'message' => 'Tenants retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve tenants',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific tenant
     */
    public function apiShow(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $tenant = $this->enterpriseService->getTenant($id, $userId);

            if (!$tenant) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Tenant not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $tenant,
                'message' => 'Tenant retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve tenant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new tenant
     */
    public function apiCreate(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'domain' => 'required|string|max:255|unique:enterprise_tenants,domain',
                'subdomain' => 'required|string|max:255|unique:enterprise_tenants,subdomain',
                'plan_type' => 'required|string|in:starter,professional,enterprise',
                'plan_configuration' => 'nullable|array',
                'billing_info' => 'nullable|array',
                'security_settings' => 'nullable|array',
                'compliance_settings' => 'nullable|array',
                'max_users' => 'required|integer|min:1',
                'max_storage_gb' => 'required|integer|min:1',
                'features_enabled' => 'nullable|array',
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
            $data['owner_id'] = $userId;
            $data['status'] = 'active';

            $tenant = $this->enterpriseService->createTenant($data);

            return ResponseFacade::json([
                'success' => true,
                'data' => $tenant,
                'message' => 'Tenant created successfully'
            ], 201);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to create tenant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a tenant
     */
    public function apiUpdate(Request $request, string $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string|max:1000',
                'plan_type' => 'sometimes|string|in:starter,professional,enterprise',
                'plan_configuration' => 'nullable|array',
                'billing_info' => 'nullable|array',
                'security_settings' => 'nullable|array',
                'compliance_settings' => 'nullable|array',
                'max_users' => 'sometimes|integer|min:1',
                'max_storage_gb' => 'sometimes|integer|min:1',
                'features_enabled' => 'nullable|array',
                'status' => 'sometimes|string|in:active,inactive,suspended',
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $tenant = $this->enterpriseService->updateTenant($id, $request->all(), $userId);

            if (!$tenant) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Tenant not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $tenant,
                'message' => 'Tenant updated successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to update tenant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a tenant
     */
    public function apiDelete(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $deleted = $this->enterpriseService->deleteTenant($id, $userId);

            if (!$deleted) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Tenant not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'message' => 'Tenant deleted successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to delete tenant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users for a tenant
     */
    public function apiGetUsers(Request $request, string $tenantId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['status', 'role', 'search']);
            $perPage = $request->get('per_page', 15);

            $users = $this->enterpriseService->getTenantUsers($tenantId, $userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $users,
                'message' => 'Tenant users retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve tenant users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add user to tenant
     */
    public function apiAddUser(Request $request, string $tenantId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|string|exists:users,id',
                'role' => 'required|string|in:admin,manager,member,viewer',
                'permissions' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $enterpriseUser = $this->enterpriseService->addUserToTenant($tenantId, $request->all(), $userId);

            return ResponseFacade::json([
                'success' => true,
                'data' => $enterpriseUser,
                'message' => 'User added to tenant successfully'
            ], 201);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to add user to tenant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove user from tenant
     */
    public function apiRemoveUser(string $tenantId, string $enterpriseUserId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $removed = $this->enterpriseService->removeUserFromTenant($tenantId, $enterpriseUserId, $userId);

            if (!$removed) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'User not found in tenant'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'message' => 'User removed from tenant successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to remove user from tenant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get projects for a tenant
     */
    public function apiGetProjects(Request $request, string $tenantId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['status', 'search']);
            $perPage = $request->get('per_page', 15);

            $projects = $this->enterpriseService->getTenantProjects($tenantId, $userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $projects,
                'message' => 'Tenant projects retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve tenant projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create project in tenant
     */
    public function apiCreateProject(Request $request, string $tenantId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'configuration' => 'nullable|array',
                'security_settings' => 'nullable|array',
                'compliance_settings' => 'nullable|array',
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
            $data['status'] = 'active';

            $project = $this->enterpriseService->createProject($tenantId, $data, $userId);

            return ResponseFacade::json([
                'success' => true,
                'data' => $project,
                'message' => 'Project created successfully'
            ], 201);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to create project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get audit logs for a tenant
     */
    public function apiGetAuditLogs(Request $request, string $tenantId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['action', 'resource_type', 'user_id', 'start_date', 'end_date']);
            $perPage = $request->get('per_page', 15);

            $logs = $this->enterpriseService->getAuditLogs($tenantId, $userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $logs,
                'message' => 'Audit logs retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve audit logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get tenant statistics
     */
    public function apiGetStats(string $tenantId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $stats = $this->enterpriseService->getTenantStats($tenantId, $userId);

            return ResponseFacade::json([
                'success' => true,
                'data' => $stats,
                'message' => 'Tenant statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve tenant statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available plan types
     */
    public function apiGetPlanTypes(): JsonResponse
    {
        try {
            $planTypes = $this->enterpriseService->getAvailablePlanTypes();

            return ResponseFacade::json([
                'success' => true,
                'data' => $planTypes,
                'message' => 'Plan types retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve plan types',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
