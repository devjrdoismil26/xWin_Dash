<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $chat_id
 * @property string $session_id
 * @property array $context
 * @property array $history
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $ended_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraUraSessionModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'aura_ura_sessions';

    protected $fillable = [
        'chat_id',
        'session_id',
        'context',
        'history',
        'status',
        'started_at',
        'ended_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'context' => 'array',
        'history' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<AuraChatModel, AuraUraSessionModel>
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(AuraChatModel::class, 'chat_id');
    }
}
