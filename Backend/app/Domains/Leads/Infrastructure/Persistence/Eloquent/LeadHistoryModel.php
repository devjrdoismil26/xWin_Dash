<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class LeadHistoryModel extends Model
{
    protected $table = 'lead_history';

    protected $fillable = [
        'lead_id',
        'event_type',
        'description',
        'properties',
        'causer_id',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    // Relacionamento com o Lead
    // public function lead()
    // {
    //     return $this->belongsTo(LeadModel::class, 'lead_id');
    // }

    // Relacionamento com o usuário que causou o evento
    // public function causer()
    // {
    //     return $this->belongsTo(User::class, 'causer_id');
    // }
}
