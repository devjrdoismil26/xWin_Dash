<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class SegmentModel extends Model
{
    protected $table = 'segments';

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'rules',
    ];

    protected $casts = [
        'rules' => 'array',
    ];

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
