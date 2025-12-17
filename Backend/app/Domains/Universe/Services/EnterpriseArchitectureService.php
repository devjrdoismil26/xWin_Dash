<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\EnterpriseTenant;
use App\Domains\Universe\Models\EnterpriseUser;
use App\Domains\Universe\Models\EnterpriseProject;
use App\Domains\Universe\Models\EnterpriseAuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnterpriseArchitectureService
{
    /**
     * Get all tenants for the authenticated user
     */
    public function getTenants(string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = EnterpriseTenant::where('owner_id', $userId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['plan_type'])) {
            $query->where('plan_type', $filters['plan_type']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('domain', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->with(['owner', 'users', 'projects'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Get a specific tenant
     */
    public function getTenant(string $id, string $userId): ?EnterpriseTenant
    {
        return EnterpriseTenant::where('id', $id)
                              ->where('owner_id', $userId)
                              ->with(['owner', 'users.user', 'projects', 'auditLogs'])
                              ->first();
    }

    /**
     * Create a new tenant
     */
    public function createTenant(array $data): EnterpriseTenant
    {
        DB::beginTransaction();
        try {
            $tenant = EnterpriseTenant::create($data);

            // Create audit log
            $this->createAuditLog([
                'tenant_id' => $tenant->id,
                'user_id' => $data['owner_id'],
                'action' => 'tenant_created',
                'resource_type' => 'tenant',
                'resource_id' => $tenant->id,
                'new_values' => $data,
            ]);

            Log::info("Enterprise tenant created: {$tenant->name} (ID: {$tenant->id})");

            DB::commit();
            return $tenant;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create enterprise tenant: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update a tenant
     */
    public function updateTenant(string $id, array $data, string $userId): ?EnterpriseTenant
    {
        $tenant = EnterpriseTenant::where('id', $id)->where('owner_id', $userId)->first();

        if (!$tenant) {
            return null;
        }

        DB::beginTransaction();
        try {
            $oldValues = $tenant->toArray();
            $tenant->update($data);

            // Create audit log
            $this->createAuditLog([
                'tenant_id' => $tenant->id,
                'user_id' => $userId,
                'action' => 'tenant_updated',
                'resource_type' => 'tenant',
                'resource_id' => $tenant->id,
                'old_values' => $oldValues,
                'new_values' => $data,
            ]);

            Log::info("Enterprise tenant updated: {$tenant->name} (ID: {$tenant->id})");

            DB::commit();
            return $tenant->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update enterprise tenant: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a tenant
     */
    public function deleteTenant(string $id, string $userId): bool
    {
        $tenant = EnterpriseTenant::where('id', $id)->where('owner_id', $userId)->first();

        if (!$tenant) {
            return false;
        }

        DB::beginTransaction();
        try {
            // Create audit log before deletion
            $this->createAuditLog([
                'tenant_id' => $tenant->id,
                'user_id' => $userId,
                'action' => 'tenant_deleted',
                'resource_type' => 'tenant',
                'resource_id' => $tenant->id,
                'old_values' => $tenant->toArray(),
            ]);

            $tenant->delete();

            Log::info("Enterprise tenant deleted: {$tenant->name} (ID: {$tenant->id})");

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to delete enterprise tenant: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get users for a tenant
     */
    public function getTenantUsers(string $tenantId, string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        $query = EnterpriseUser::where('tenant_id', $tenantId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (isset($filters['search'])) {
            $query->whereHas('user', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->with(['user', 'tenant'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Add user to tenant
     */
    public function addUserToTenant(string $tenantId, array $userData, string $userId): EnterpriseUser
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        DB::beginTransaction();
        try {
            $enterpriseUser = EnterpriseUser::create([
                'tenant_id' => $tenantId,
                'user_id' => $userData['user_id'],
                'role' => $userData['role'] ?? 'member',
                'permissions' => $userData['permissions'] ?? [],
                'status' => 'pending',
                'invited_at' => now(),
            ]);

            // Create audit log
            $this->createAuditLog([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'action' => 'user_added',
                'resource_type' => 'enterprise_user',
                'resource_id' => $enterpriseUser->id,
                'new_values' => $userData,
            ]);

            Log::info("User added to enterprise tenant: {$enterpriseUser->id}");

            DB::commit();
            return $enterpriseUser;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to add user to tenant: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Remove user from tenant
     */
    public function removeUserFromTenant(string $tenantId, string $enterpriseUserId, string $userId): bool
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        $enterpriseUser = EnterpriseUser::where('id', $enterpriseUserId)
                                       ->where('tenant_id', $tenantId)
                                       ->first();

        if (!$enterpriseUser) {
            return false;
        }

        DB::beginTransaction();
        try {
            // Create audit log
            $this->createAuditLog([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'action' => 'user_removed',
                'resource_type' => 'enterprise_user',
                'resource_id' => $enterpriseUser->id,
                'old_values' => $enterpriseUser->toArray(),
            ]);

            $enterpriseUser->delete();

            Log::info("User removed from enterprise tenant: {$enterpriseUser->id}");

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to remove user from tenant: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get projects for a tenant
     */
    public function getTenantProjects(string $tenantId, string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        $query = EnterpriseProject::where('tenant_id', $tenantId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query->with(['tenant'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Create project in tenant
     */
    public function createProject(string $tenantId, array $data, string $userId): EnterpriseProject
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        DB::beginTransaction();
        try {
            $data['tenant_id'] = $tenantId;
            $project = EnterpriseProject::create($data);

            // Create audit log
            $this->createAuditLog([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'project_id' => $project->id,
                'action' => 'project_created',
                'resource_type' => 'enterprise_project',
                'resource_id' => $project->id,
                'new_values' => $data,
            ]);

            Log::info("Enterprise project created: {$project->name} (ID: {$project->id})");

            DB::commit();
            return $project;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create enterprise project: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get audit logs for a tenant
     */
    public function getAuditLogs(string $tenantId, string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        $query = EnterpriseAuditLog::where('tenant_id', $tenantId);

        // Apply filters
        if (isset($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (isset($filters['resource_type'])) {
            $query->where('resource_type', $filters['resource_type']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date']);
        }

        return $query->with(['user', 'project'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Get tenant statistics
     */
    public function getTenantStats(string $tenantId, string $userId): array
    {
        // Verify user has access to tenant
        $tenant = EnterpriseTenant::where('id', $tenantId)
                                 ->where('owner_id', $userId)
                                 ->first();

        if (!$tenant) {
            throw new \Exception('Tenant not found or access denied');
        }

        return [
            'users_count' => $tenant->users()->count(),
            'projects_count' => $tenant->projects()->count(),
            'active_users_count' => $tenant->users()->where('status', 'active')->count(),
            'active_projects_count' => $tenant->projects()->where('status', 'active')->count(),
            'audit_logs_count' => $tenant->auditLogs()->count(),
            'storage_usage' => $tenant->getUsageStats(),
        ];
    }

    /**
     * Get available plan types
     */
    public function getAvailablePlanTypes(): array
    {
        return [
            'starter' => [
                'name' => 'Starter',
                'max_users' => 10,
                'max_storage_gb' => 10,
                'features' => ['basic_analytics', 'standard_support'],
                'price' => 29.99
            ],
            'professional' => [
                'name' => 'Professional',
                'max_users' => 50,
                'max_storage_gb' => 100,
                'features' => ['advanced_analytics', 'priority_support', 'custom_integrations'],
                'price' => 99.99
            ],
            'enterprise' => [
                'name' => 'Enterprise',
                'max_users' => -1, // Unlimited
                'max_storage_gb' => -1, // Unlimited
                'features' => ['enterprise_analytics', 'dedicated_support', 'custom_integrations', 'sso', 'audit_logs'],
                'price' => 299.99
            ]
        ];
    }

    /**
     * Create audit log entry
     */
    private function createAuditLog(array $data): EnterpriseAuditLog
    {
        return EnterpriseAuditLog::create($data);
    }
}
