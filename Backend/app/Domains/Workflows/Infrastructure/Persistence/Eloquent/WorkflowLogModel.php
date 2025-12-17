<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

/**
 * Model para logs de workflow.
 *
 * @property int $id
 * @property int|null $workflow_execution_id
 * @property int|null $node_id
 * @property string $event_type
 * @property string|null $message
 * @property array<string, mixed>|null $payload
 * @property string|null $status
 * @property \DateTimeImmutable|null $created_at
 * @property \DateTimeImmutable|null $updated_at
 *
 * @method static self create(array<string, mixed> $attributes = [])
 * @method static self|null find(mixed $id, array<int, string> $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 */
class WorkflowLogModel extends Model
{
    protected $table = 'workflow_logs';

    protected $fillable = [
        'execution_id',
        'node_id',
        'node_type',
        'status',
        'input',
        'output',
        'error_message',
        'started_at',
        'completed_at',
        'execution_time',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'input' => 'array',
        'output' => 'array',
        'execution_time' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function execution()
    {
        return $this->belongsTo(WorkflowExecutionModel::class, 'execution_id');
    }
}
