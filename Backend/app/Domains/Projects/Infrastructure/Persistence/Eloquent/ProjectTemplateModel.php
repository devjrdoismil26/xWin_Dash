<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTemplateModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'project_templates';

    protected $fillable = [
        'name',
        'description',
        'structure',
        'default_tasks',
        'default_milestones',
        'is_public',
        'created_by',
    ];

    protected $casts = [
        'structure' => 'array',
        'default_tasks' => 'array',
        'default_milestones' => 'array',
        'is_public' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
