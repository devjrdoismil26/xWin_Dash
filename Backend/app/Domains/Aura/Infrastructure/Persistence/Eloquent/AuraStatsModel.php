<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * AuraStatsModel
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 * 
 * @property string $id
 * @property string $connection_id
 * @property string $date
 * @property int $messages_received
 * @property int $messages_sent
 * @property int $active_chats
 * @property array $metrics
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraStatsModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'aura_stats';

    protected $fillable = [
        'connection_id',
        'date',
        'messages_sent',
        'messages_received',
        'chats_opened',
        'chats_closed',
        'avg_response_time',
        'flows_executed',
        'templates_sent',
        'success_rate',
        'metrics',
        'project_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'messages_sent' => 'integer',
        'messages_received' => 'integer',
        'chats_opened' => 'integer',
        'chats_closed' => 'integer',
        'avg_response_time' => 'integer',
        'flows_executed' => 'integer',
        'templates_sent' => 'integer',
        'success_rate' => 'decimal:2',
        'metrics' => 'array',
    ];

    /**
     * @return BelongsTo<AuraConnectionModel, AuraStatsModel>
     */
    public function connection(): BelongsTo
    {
        return $this->belongsTo(AuraConnectionModel::class, 'connection_id');
    }
}
