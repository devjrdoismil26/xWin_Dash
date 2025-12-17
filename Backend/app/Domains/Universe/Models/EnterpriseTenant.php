<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property string $domain
 * @property string $subdomain
 * @property string $plan_type
 * @property array<string, mixed>|null $plan_configuration
 * @property array<string, mixed>|null $billing_info
 * @property array<string, mixed>|null $security_settings
 * @property array<string, mixed>|null $compliance_settings
 * @property string $status
 * @property int $max_users
 * @property int $max_storage_gb
 * @property array<string, mixed>|null $features_enabled
 * @property array<string, mixed>|null $metadata
 * @property string $owner_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read User $owner
 * @property-read \Illuminate\Database\Eloquent\Collection<int, EnterpriseUser> $users
 * @property-read \Illuminate\Database\Eloquent\Collection<int, EnterpriseProject> $projects
 * @property-read \Illuminate\Database\Eloquent\Collection<int, EnterpriseAuditLog> $auditLogs
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class EnterpriseTenant extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'enterprise_tenants';

    protected $fillable = [
        'name',
        'description',
        'domain',
        'subdomain',
        'plan_type',
        'plan_configuration',
        'billing_info',
        'security_settings',
        'compliance_settings',
        'status',
        'max_users',
        'max_storage_gb',
        'features_enabled',
        'metadata',
        'owner_id',
    ];

    protected $casts = [
        'plan_configuration' => 'array',
        'billing_info' => 'array',
        'security_settings' => 'array',
        'compliance_settings' => 'array',
        'features_enabled' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the owner of the tenant
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get all users in this tenant
     */
    public function users(): HasMany
    {
        return $this->hasMany(EnterpriseUser::class, 'tenant_id');
    }

    /**
     * Get all projects in this tenant
     */
    public function projects(): HasMany
    {
        return $this->hasMany(EnterpriseProject::class, 'tenant_id');
    }

    /**
     * Get audit logs for this tenant
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(EnterpriseAuditLog::class, 'tenant_id');
    }

    /**
     * Scope for active tenants
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for tenants by plan type
     */
    public function scopeByPlan($query, string $planType)
    {
        return $query->where('plan_type', $planType);
    }

    /**
     * Check if tenant has a specific feature enabled
     */
    public function hasFeature(string $feature): bool
    {
        return in_array($feature, $this->features_enabled ?? []);
    }

    /**
     * Get tenant usage statistics
     */
    public function getUsageStats(): array
    {
        return [
            'users_count' => $this->users()->count(),
            'projects_count' => $this->projects()->count(),
            'storage_used_gb' => $this->calculateStorageUsed(),
            'users_limit' => $this->max_users,
            'storage_limit_gb' => $this->max_storage_gb,
        ];
    }

    /**
     * Calculate storage used by tenant
     */
    private function calculateStorageUsed(): float
    {
        // This would typically query actual storage usage
        // For now, return a placeholder
        return 0.0;
    }
}
