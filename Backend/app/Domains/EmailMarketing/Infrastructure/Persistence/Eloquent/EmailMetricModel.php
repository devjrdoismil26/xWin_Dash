<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailMetricModel extends Model
{
    protected $table = 'email_metrics';

    protected $fillable = [
        'email_log_id',
        'metric_type',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    // Relacionamento com o log de e-mail
    // public function emailLog()
    // {
    //     return $this->belongsTo(EmailLogModel::class, 'email_log_id');
    // }
}
