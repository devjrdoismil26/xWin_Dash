<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Domains\Workflows\Models\WorkflowVersion.
 *
 * @property int $id
 * @property int $workflow_id
 * @property array $definition
 * @property string|null $version_name
 * @property string|null $description
 * @property int|null $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property User|null $user
 * @property \App\Domains\Workflows\Models\Workflow $workflow
 *
 * @method static \Database\Factories\Workflows\WorkflowVersionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion query()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereDefinition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereVersionName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkflowVersion whereWorkflowId($value)
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 *
 * @method static self create(array $attributes = [])
 * @method static self find(mixed $id, array $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 */
class WorkflowVersionModel extends Model
{
    use HasFactory;

    /**
     * @return \Database\Factories\Workflows\WorkflowVersionFactory
     */
    protected static function newFactory()
    {
        return \Database\Factories\Workflows\WorkflowVersionFactory::new();
    }

    protected $fillable = [
        'workflow_id',
        'definition',
        'version_name',
        'description',
        'user_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'definition' => 'array',
    ];

    /**
     * Get the workflow that owns the version.
     */
    public function workflow(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel::class);
    }

    /**
     * Get the user that created the version.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
