<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailSegment extends Model
{
    protected $table = 'email_segments';

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
