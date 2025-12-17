<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailCampaignMetricModel extends Model
{
    protected $table = 'email_campaign_metrics';

    protected $fillable = [
        'campaign_id',
        'metric_type',
        'value',
    ];

    // Relacionamento com a campanha de e-mail
    // public function campaign()
    // {
    //     return $this->belongsTo(EmailCampaignModel::class, 'campaign_id');
    // }
}
