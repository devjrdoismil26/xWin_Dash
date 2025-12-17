<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $chat_id
 * @property string $message_id
 * @property string $type
 * @property string $direction
 * @property array $content
 * @property array $metadata
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraMessageModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'aura_messages';

    protected $fillable = [
        'chat_id',
        'whatsapp_message_id',
        'direction',
        'type',
        'content',
        'media',
        'metadata',
        'status',
        'sent_at',
        'delivered_at',
        'read_at',
        'error_message',
        'is_template',
        'template_name',
        'template_params',
        'sent_by',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'media' => 'array',
        'metadata' => 'array',
        'template_params' => 'array',
        'is_template' => 'boolean',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<AuraChatModel, AuraMessageModel>
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(AuraChatModel::class, 'chat_id');
    }

    /**
     * @return BelongsTo<\App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel, AuraMessageModel>
     */
    public function sentBy(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel::class, 'sent_by');
    }
}
