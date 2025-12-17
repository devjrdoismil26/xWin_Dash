<?php

namespace App\Domains\Activity\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * ActivityLogModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 */
class ActivityLogModel extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected $table = 'activity_log';

    protected $fillable = [
        'log_name',
        'description',
        'subject_type',
        'subject_id',
        'causer_type',
        'causer_id',
        'properties',
        'project_id',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function newFactory()
    {
        return \Database\Factories\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModelFactory::new();
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid();
            }
        });
    }

    /**
     * Get the subject of the activity.
     */
    public function subject()
    {
        return $this->morphTo();
    }

    /**
     * Get the causer of the activity.
     */
    public function causer()
    {
        return $this->morphTo();
    }
}
