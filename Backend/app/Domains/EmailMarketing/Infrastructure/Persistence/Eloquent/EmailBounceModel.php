<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailBounceModel extends Model
{
    protected $table = 'email_bounces';

    protected $fillable = [
        'email_log_id',
        'bounce_type',
        'reason',
        'bounced_at',
    ];

    protected $casts = [
        'bounced_at' => 'datetime',
    ];

    // Relacionamento com o log de e-mail
    // public function emailLog()
    // {
    //     return $this->belongsTo(EmailLogModel::class, 'email_log_id');
    // }
}
