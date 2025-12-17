<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmailCampaignModel extends Model
{
    use HasUuids;
    use HasFactory;
    use SoftDeletes;

    protected $table = 'email_campaigns';

    protected $fillable = [
        'name',
        'description',
        'subject',
        'preview_text',
        'from_name',
        'from_email',
        'reply_to',
        'html_content',
        'text_content',
        'type',
        'status',
        'scheduled_at',
        'sent_at',
        'recipients_count',
        'sent_count',
        'delivered_count',
        'opened_count',
        'clicked_count',
        'bounced_count',
        'unsubscribed_count',
        'open_rate',
        'click_rate',
        'bounce_rate',
        'settings',
        'project_id',
        'created_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'recipients_count' => 'integer',
        'sent_count' => 'integer',
        'delivered_count' => 'integer',
        'opened_count' => 'integer',
        'clicked_count' => 'integer',
        'bounced_count' => 'integer',
        'unsubscribed_count' => 'integer',
        'open_rate' => 'decimal:2',
        'click_rate' => 'decimal:2',
        'bounce_rate' => 'decimal:2',
        'settings' => 'array',
    ];

    public static function newFactory()
    {
        return \Database\Factories\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModelFactory::new();
    }

    // Relacionamento com a lista de e-mail
    // public function emailList()
    // {
    //     return $this->belongsTo(EmailListModel::class, 'email_list_id');
    // }

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
