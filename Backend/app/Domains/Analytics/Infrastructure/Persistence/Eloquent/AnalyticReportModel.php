<?php

namespace App\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AnalyticReportModel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'analytic_reports';

    protected $fillable = [
        'name',
        'report_type',
        'start_date',
        'end_date',
        'data',
        'user_id',
        'status',
        'generated_at',
        'properties',
    ];

    protected $casts = [
        'data' => 'array',
        'properties' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'generated_at' => 'datetime',
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
        return \Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticReportModelFactory::new();
    }

    // Relacionamento com o usuário que gerou o relatório
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}
