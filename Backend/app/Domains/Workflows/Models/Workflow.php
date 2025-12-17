<?php

namespace App\Domains\Workflows\Models;

use App\Models\User;
use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Workflow Model
 * 
 * SECURITY FIX (MODEL-001): Adicionado BelongsToProject trait para multi-tenancy
 * 
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property array $steps
 * @property array|null $configuration
 * @property string $status
 * @property string $user_id
 * @property string|null $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, WorkflowExecution> $executions
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Workflow extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected static function newFactory()
    {
        return \Database\Factories\WorkflowFactory::new();
    }

    protected $table = 'workflows';

    protected $fillable = [
        'name',
        'description',
        'status',
        'definition',
        'settings',
        'variables',
        'last_executed_at',
        'execution_count',
        'is_template',
        'category',
        'tags',
        'user_id',
        'project_id',
    ];

    protected $casts = [
        'definition' => 'array',
        'settings' => 'array',
        'variables' => 'array',
        'tags' => 'array',
        'is_template' => 'boolean',
        'execution_count' => 'integer',
        'last_executed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who owns the workflow
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all executions for this workflow
     */
    public function executions(): HasMany
    {
        return $this->hasMany(WorkflowExecution::class, 'workflow_id');
    }

    /**
     * Get all nodes for this workflow
     */
    public function nodes(): HasMany
    {
        return $this->hasMany(WorkflowNode::class, 'workflow_id');
    }

    /**
     * Get all triggers for this workflow
     */
    public function triggers(): HasMany
    {
        return $this->hasMany(WorkflowTrigger::class, 'workflow_id');
    }

    /**
     * Scope for active workflows
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for workflows by user
     */
    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for templates
     */
    public function scopeTemplates($query)
    {
        return $query->where('is_template', true);
    }
}
