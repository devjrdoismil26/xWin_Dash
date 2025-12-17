<?php

namespace App\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AnalyticsGoalModel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'analytics_goals';

    protected $fillable = [
        'name',
        'description',
        'goal_type',
        'target_value',
        'current_value',
        'status',
        'start_date',
        'end_date',
        'user_id',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'target_value' => 'decimal:2',
        'current_value' => 'decimal:2',
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
        return \Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsGoalModelFactory::new();
    }
}
