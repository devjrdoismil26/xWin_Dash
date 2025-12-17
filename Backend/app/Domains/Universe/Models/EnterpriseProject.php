<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $name
 * @property string|null $description
 * @property string $status
 * @property array<string, mixed>|null $configuration
 * @property array<string, mixed>|null $security_settings
 * @property array<string, mixed>|null $compliance_settings
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read EnterpriseTenant $tenant
 * @property-read \Illuminate\Database\Eloquent\Collection<int, EnterpriseAuditLog> $auditLogs
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class EnterpriseProject extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'enterprise_projects';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'status',
        'configuration',
        'security_settings',
        'compliance_settings',
        'metadata',
    ];

    protected $casts = [
        'configuration' => 'array',
        'security_settings' => 'array',
        'compliance_settings' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the tenant this project belongs to
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(EnterpriseTenant::class, 'tenant_id');
    }

    /**
     * Get audit logs for this project
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(EnterpriseAuditLog::class, 'project_id');
    }

    /**
     * Scope for active projects
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for projects by tenant
     */
    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }
}
