<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

/**
 * Model para execuções de workflows.
 *
 * @property int $id
 * @property int $workflow_id
 * @property string $status
 * @property array|null $input_data
 * @property array|null $output_data
 * @property array|null $execution_log
 * @property array|null $node_results
 * @property \DateTime|null $started_at
 * @property \DateTime|null $completed_at
 * @property int|null $execution_time_ms
 * @property string|null $error_message
 * @property string|null $trigger_type
 * @property array|null $trigger_data
 * @property int|null $user_id
 * @property \DateTimeImmutable|null $created_at
 * @property \DateTimeImmutable|null $updated_at
 *
 * @method static self create(array<string, mixed> $attributes = [])
 * @method static self|null find(mixed $id, array<int, string> $columns = ['*'])
 * @method static self findOrFail(mixed $id, array<int, string> $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 */
class WorkflowExecutionModel extends Model
{
    protected $table = 'workflow_executions';

    protected $fillable = [
        'workflow_id',
        'status',
        'input_data',
        'output_data',
        'execution_log',
        'node_results',
        'started_at',
        'completed_at',
        'execution_time_ms',
        'error_message',
        'trigger_type',
        'trigger_data',
        'user_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'input_data' => 'array',
        'output_data' => 'array',
        'execution_log' => 'array',
        'node_results' => 'array',
        'trigger_data' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'execution_time_ms' => 'integer',
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
    ];

    // Relacionamento com o workflow
    public function workflow()
    {
        return $this->belongsTo(WorkflowModel::class, 'workflow_id');
    }

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
