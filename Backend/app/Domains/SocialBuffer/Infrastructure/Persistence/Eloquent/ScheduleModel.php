<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;

/**
 * ScheduleModel - Infrastructure Layer Model
 * 
 * SECURITY FIX (SCOPE-003): Adicionado BelongsToProject para multi-tenancy
 */
class ScheduleModel extends Model
{
    use BelongsToProject;

    protected $table = 'social_schedules';

    protected $fillable = [
        'post_id',
        'project_id',
        'scheduled_at',
        'platform',
        'status',
        'published_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    // Relacionamento com o Post
    // public function post()
    // {
    //     return $this->belongsTo(PostModel::class, 'post_id');
    // }
}
