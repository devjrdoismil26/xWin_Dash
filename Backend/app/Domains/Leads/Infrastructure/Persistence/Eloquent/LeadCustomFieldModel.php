<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class LeadCustomFieldModel extends Model
{
    protected $table = 'lead_custom_fields';

    protected $fillable = [
        'name',
        'type',
        'description',
        'user_id',
    ];

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
