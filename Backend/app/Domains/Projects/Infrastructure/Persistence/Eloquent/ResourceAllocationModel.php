<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourceAllocationModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'resource_allocations';

    protected $fillable = [
        'project_id',
        'user_id',
        'task_id',
        'allocated_hours',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'allocated_hours' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class, 'project_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(TaskModel::class, 'task_id');
    }
}
