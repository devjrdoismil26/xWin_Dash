<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use App\Shared\Traits\OptimizedQueries;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Projects\Models\Task.
 *
 * @property \App\Domains\Users\Models\User|null       $assignedTo
 * @property \App\Domains\Projects\Models\Project|null $project
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder|Task withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Task withoutTrashed()
 *
 * @mixin \Eloquent
 */
class TaskModel extends Model
{
    use HasUuids;
    use SoftDeletes;
    use OptimizedQueries;

    protected $fillable = ['project_id', 'name', 'description', 'due_date', 'status', 'assigned_to_user_id'];

    protected $casts = [
        'due_date' => 'datetime',
        'status' => 'string',
    ];

    protected array $defaultEagerLoad = [
        'project:id,name',
        'assignedTo:id,name,email',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }
}
