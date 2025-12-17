<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Domains\Workflows\Models\WorkflowLead.
 *
 * @property string $id
 * @property string $workflow_id
 * @property string $lead_id
 * @property string $status
 * @property string|null $current_node_id
 * @property \Illuminate\Support\Carbon $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property string|null $error_message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \App\Domains\Workflows\Models\Workflow $workflow
 * @property \App\Domains\Leads\Models\Lead $lead
 *
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead query()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereCurrentNodeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereErrorMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereLeadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowLead whereWorkflowId($value)
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 *
 * @method static self create(array $attributes = [])
 * @method static self find(mixed $id, array $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 */
class WorkflowLeadModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'workflow_leads';

    protected $fillable = [
        'workflow_id',
        'lead_id',
        'status',
        'current_node_id',
        'started_at',
        'completed_at',
        'error_message',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the workflow that owns the WorkflowLead.
     */
    public function workflow(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel::class);
    }

    /**
     * Get the lead that owns the WorkflowLead.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
