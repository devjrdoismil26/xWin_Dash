<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailCampaignSegmentModel extends Model
{
    protected $table = 'email_campaign_segments';

    protected $fillable = [
        'campaign_id',
        'segment_id',
    ];

    // Relacionamento com a campanha de e-mail
    // public function campaign()
    // {
    //     return $this->belongsTo(EmailCampaignModel::class, 'campaign_id');
    // }

    // Relacionamento com o segmento de e-mail
    // public function segment()
    // {
    //     return $this->belongsTo(EmailSegmentModel::class, 'segment_id');
    // }
}
