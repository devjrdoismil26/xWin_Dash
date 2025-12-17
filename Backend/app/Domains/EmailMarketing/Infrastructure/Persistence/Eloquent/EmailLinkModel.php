<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailLinkModel extends Model
{
    protected $table = 'email_links';

    protected $fillable = [
        'campaign_id',
        'original_url',
        'tracked_url',
        'clicks',
    ];

    protected $casts = [
        'clicks' => 'integer',
    ];

    // Relacionamento com a campanha de e-mail
    // public function campaign()
    // {
    //     return $this->belongsTo(EmailCampaignModel::class, 'campaign_id');
    // }
}
