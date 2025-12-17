<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class LeadCustomValueModel extends Model
{
    protected $table = 'lead_custom_values';

    protected $fillable = [
        'lead_id',
        'custom_field_id',
        'value',
    ];

    // Relacionamento com o Lead
    // public function lead()
    // {
    //     return $this->belongsTo(LeadModel::class, 'lead_id');
    // }

    // Relacionamento com o campo personalizado
    // public function customField()
    // {
    //     return $this->belongsTo(LeadCustomFieldModel::class, 'custom_field_id');
    // }
}
