<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

/**
 * Model para nós de workflow.
 *
 * @property int $id
 * @property int $workflow_id
 * @property string|null $name
 * @property string $type
 * @property array<string, mixed> $config
 * @property float|null $position_x
 * @property float|null $position_y
 * @property int|null $next_node_id
 * @property int|null $true_node_id
 * @property int|null $false_node_id
 * @property \DateTimeImmutable|null $created_at
 * @property \DateTimeImmutable|null $updated_at
 *
 * @method static self create(array<string, mixed> $attributes = [])
 * @method static self|null find(mixed $id, array<int, string> $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 */
class WorkflowNodeModel extends Model
{
    protected $table = 'workflow_nodes';

    protected $fillable = [
        'workflow_id',
        'node_id',
        'type',
        'label',
        'configuration',
        'position',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'configuration' => 'array',
        'position' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function workflow()
    {
        return $this->belongsTo(WorkflowModel::class, 'workflow_id');
    }
}
