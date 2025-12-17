<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class EmailSubscriberModel extends Model
{
    protected $table = 'email_subscribers';

    protected $fillable = [
        'email',
        'name',
        'status',
        'custom_fields',
    ];

    protected $casts = [
        'custom_fields' => 'array',
    ];

    // Relacionamento com as listas de e-mail
    // public function emailLists()
    // {
    //     return $this->belongsToMany(EmailListModel::class, 'email_list_subscribers', 'email_subscriber_id', 'email_list_id');
    // }
}
