<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class LeadEmailModel extends Model
{
    protected $table = 'lead_emails';

    protected $fillable = [
        'lead_id',
        'subject',
        'body',
        'sent_at',
        'opened_at',
        'clicked_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
    ];

    // Relacionamento com o Lead
    // public function lead()
    // {
    //     return $this->belongsTo(LeadModel::class, 'lead_id');
    // }
}
