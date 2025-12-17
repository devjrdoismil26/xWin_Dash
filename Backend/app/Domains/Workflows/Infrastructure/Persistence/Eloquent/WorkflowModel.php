<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Model para workflows.
 *
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property string $status
 * @property array<string, mixed> $definition
 * @property string|null $user_id
 * @property string|null $project_id
 * @property \DateTimeImmutable|null $created_at
 * @property \DateTimeImmutable|null $updated_at
 *
 * @method static self create(array<string, mixed> $attributes = [])
 * @method static self|null find(mixed $id, array<int, string> $columns = ['*'])
 * @method static self findOrFail(mixed $id, array<int, string> $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 */
class WorkflowModel extends Model
{
    use HasFactory;

    protected $table = 'workflows';
    
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'description',
        'status',
        'definition',
        'user_id',
        'project_id',
        'settings',
        'variables',
        'last_executed_at',
        'execution_count',
        'is_template',
        'category',
        'tags',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'definition' => 'array',
        'settings' => 'array',
        'variables' => 'array',
        'tags' => 'array',
        'last_executed_at' => 'datetime',
        'is_template' => 'boolean',
        'execution_count' => 'integer',
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
    ];

    // Using integer primary key as per database schema

    public static function newFactory()
    {
        return \Database\Factories\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModelFactory::new();
    }

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    // Relacionamento com o projeto
    // public function project()
    // {
    //     return $this->belongsTo(Project::class, 'project_id');
    // }

    // Relacionamento com as execuções do workflow
    // public function executions()
    // {
    //     return $this->hasMany(WorkflowExecutionModel::class, 'workflow_id');
    // }
}
