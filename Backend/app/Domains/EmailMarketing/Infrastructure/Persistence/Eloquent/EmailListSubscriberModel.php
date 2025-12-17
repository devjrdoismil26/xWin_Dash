<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailListSubscriberModel extends Model
{
    protected $table = 'email_list_subscribers';

    protected $fillable = [
        'email_list_id',
        'email_subscriber_id',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    // Relacionamento com a lista de e-mail
    // public function emailList()
    // {
    //     return $this->belongsTo(EmailListModel::class, 'email_list_id');
    // }

    // Relacionamento com o assinante de e-mail
    // public function emailSubscriber()
    // {
    //     return $this->belongsTo(EmailSubscriberModel::class, 'email_subscriber_id');
    // }
}
