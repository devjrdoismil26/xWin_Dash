<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailListModel extends Model
{
    protected $table = 'email_lists';

    protected $fillable = [
        'name',
        'description',
        'user_id',
    ];

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    // Relacionamento com os assinantes da lista
    // public function subscribers()
    // {
    //     return $this->hasMany(EmailListSubscriberModel::class, 'email_list_id');
    // }
}
