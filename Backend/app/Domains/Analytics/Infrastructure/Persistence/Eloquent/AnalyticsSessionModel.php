<?php

namespace App\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AnalyticsSessionModel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'analytics_sessions';

    protected $fillable = [
        'session_id',
        'user_id',
        'start_time',
        'end_time',
        'duration',
        'page_views',
        'bounce_rate',
        'device_type',
        'browser',
        'os',
        'country',
        'city',
        'referrer',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration' => 'integer',
        'page_views' => 'integer',
        'bounce_rate' => 'decimal:2',
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
        return \Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsSessionModelFactory::new();
    }
}
