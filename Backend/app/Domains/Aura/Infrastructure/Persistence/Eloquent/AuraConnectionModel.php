<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AuraConnectionModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 * SECURITY FIX: Criptografia de credentials
 * 
 * @property string $id
 * @property string $user_id
 * @property string $project_id
 * @property string $name
 * @property string $type
 * @property array $config
 * @property string $status
 * @property string $is_active
 * @property string $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraConnectionModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'aura_connections';

    protected $fillable = [
        'name',
        'description',
        'phone_number',
        'business_name',
        'status',
        'connection_type',
        'credentials',
        'settings',
        'webhook_config',
        'last_activity_at',
        'connected_at',
        'disconnected_at',
        'error_message',
        'messages_sent_today',
        'messages_received_today',
        'daily_reset_date',
        'project_id',
        'created_by',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'credentials' => 'encrypted:array', // SECURITY FIX: Criptografia de credenciais
        'settings' => 'array',
        'webhook_config' => 'array',
        'last_activity_at' => 'datetime',
        'connected_at' => 'datetime',
        'disconnected_at' => 'datetime',
        'messages_sent_today' => 'integer',
        'messages_received_today' => 'integer',
        'daily_reset_date' => 'date',
    ];

    /**
     * @return HasMany<AuraChatModel>
     */
    public function chats(): HasMany
    {
        return $this->hasMany(AuraChatModel::class, 'connection_id');
    }

    /**
     * @return HasMany<AuraFlowModel>
     */
    public function flows(): HasMany
    {
        return $this->hasMany(AuraFlowModel::class, 'connection_id');
    }

    /**
     * @return HasMany<AuraStatsModel>
     */
    public function stats(): HasMany
    {
        return $this->hasMany(AuraStatsModel::class, 'connection_id');
    }
}
