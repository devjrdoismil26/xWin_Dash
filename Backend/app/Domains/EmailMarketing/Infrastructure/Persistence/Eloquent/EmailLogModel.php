<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailLogModel extends Model
{
    protected $table = 'email_logs';

    protected $fillable = [
        'campaign_id',
        'subscriber_id',
        'status',
        'message_id',
        'error_message',
        'sent_at',
        'opened_at',
        'clicked_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
    ];

    // Relacionamento com a campanha de e-mail
    // public function campaign()
    // {
    //     return $this->belongsTo(EmailCampaignModel::class, 'campaign_id');
    // }

    // Relacionamento com o assinante de e-mail
    // public function subscriber()
    // {
    //     return $this->belongsTo(EmailSubscriberModel::class, 'subscriber_id');
    // }
}
