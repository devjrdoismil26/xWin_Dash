<?php

namespace App\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AnalyticsEventModel extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected $table = 'analytics_events';

    protected $fillable = [
        'event_name',
        'event_category',
        'user_id',
        'session_id',
        'ip_address',
        'user_agent',
        'referrer',
        'properties',
        'occurred_at',
        'project_id',
    ];

    protected $casts = [
        'properties' => 'array',
        'occurred_at' => 'datetime',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid();
            }
        });
    }

    protected static function newFactory()
    {
        return \Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsEventModelFactory::new();
    }
}
