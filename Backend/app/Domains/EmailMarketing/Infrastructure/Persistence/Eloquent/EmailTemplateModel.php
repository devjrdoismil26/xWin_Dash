<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailTemplateModel extends Model
{
    protected $table = 'email_templates';

    protected $fillable = [
        'name',
        'subject',
        'body',
        'user_id',
    ];

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
