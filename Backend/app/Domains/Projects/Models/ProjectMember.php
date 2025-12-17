<?php

namespace App\Domains\Projects\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ProjectMember Model
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 */
class ProjectMember extends Model
{
    use HasFactory, HasUuids;
    use BelongsToProject;

    protected $table = 'project_members';

    protected $fillable = [
        'project_id',
        'user_id',
        'role',
        'permissions',
        'invited_by',
        'invited_at',
        'joined_at',
    ];

    protected $casts = [
        'permissions' => 'array',
        'invited_at' => 'datetime',
        'joined_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'invited_by');
    }

    // Scopes
    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    // Methods
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasPermission(string $permission): bool
    {
        $permissions = $this->permissions ?? [];
        return in_array($permission, $permissions);
    }
}
