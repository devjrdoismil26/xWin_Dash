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
 * @property string $tenant_id
 * @property string $user_id
 * @property string $role
 * @property array<string, mixed>|null $permissions
 * @property array<string, mixed>|null $profile_data
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $last_login_at
 * @property \Illuminate\Support\Carbon|null $invited_at
 * @property \Illuminate\Support\Carbon|null $accepted_at
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read EnterpriseTenant $tenant
 * @property-read User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, EnterpriseAuditLog> $auditLogs
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class EnterpriseUser extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'enterprise_users';

    protected $fillable = [
        'tenant_id',
        'user_id',
        'role',
        'permissions',
        'profile_data',
        'status',
        'last_login_at',
        'invited_at',
        'accepted_at',
        'metadata',
    ];

    protected $casts = [
        'permissions' => 'array',
        'profile_data' => 'array',
        'metadata' => 'array',
        'last_login_at' => 'datetime',
        'invited_at' => 'datetime',
        'accepted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the tenant this user belongs to
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(EnterpriseTenant::class, 'tenant_id');
    }

    /**
     * Get the user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get audit logs for this user
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(EnterpriseAuditLog::class, 'user_id');
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for users by role
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
