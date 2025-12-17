<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailUnsubscribeModel extends Model
{
    protected $table = 'email_unsubscribes';

    protected $fillable = [
        'email',
        'email_subscriber_id',
        'email_list_id',
        'reason',
        'unsubscribed_at',
    ];

    protected $casts = [
        'unsubscribed_at' => 'datetime',
    ];

    // Relacionamento com o assinante de e-mail
    // public function emailSubscriber()
    // {
    //     return $this->belongsTo(EmailSubscriberModel::class, 'email_subscriber_id');
    // }

    // Relacionamento com a lista de e-mail
    // public function emailList()
    // {
    //     return $this->belongsTo(EmailListModel::class, 'email_list_id');
    // }
}
