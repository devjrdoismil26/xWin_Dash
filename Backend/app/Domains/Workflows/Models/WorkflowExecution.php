<?php

namespace App\Domains\Workflows\Models;

use App\Models\User;
use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WorkflowExecution Model
 * 
 * SECURITY FIX (MODEL-001): Adicionado BelongsToProject trait para multi-tenancy
 * 
 * @property string $id
 * @property string $workflow_id
 * @property string|null $project_id
 * @property string $status
 * @property array|null $input_data
 * @property array|null $output_data
 * @property array|null $execution_data
 * @property string|null $error_message
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read Workflow $workflow
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class WorkflowExecution extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'workflow_executions';

    protected $fillable = [
        'workflow_id',
        'project_id',
        'status',
        'trigger_type',
        'trigger_data',
        'context',
        'current_node_id',
        'started_at',
        'completed_at',
        'error_message',
        'execution_time',
        'user_id',
    ];

    protected $casts = [
        'trigger_data' => 'array',
        'context' => 'array',
        'execution_time' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the workflow that owns the execution
     */
    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class, 'workflow_id');
    }

    /**
     * Get the user who triggered the execution
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all logs for this execution
     */
    public function logs()
    {
        return $this->hasMany(WorkflowLog::class, 'execution_id');
    }

    /**
     * Scope for executions by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for executions by workflow
     */
    public function scopeByWorkflow($query, string $workflowId)
    {
        return $query->where('workflow_id', $workflowId);
    }
}
