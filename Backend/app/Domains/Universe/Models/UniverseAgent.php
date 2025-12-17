<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $type
 * @property array<string, mixed>|null $configuration
 * @property string $status
 * @property int $user_id
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read User $user
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class UniverseAgent extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'universe_agents';

    protected $fillable = [
        'name',
        'description',
        'type',
        'configuration',
        'status',
        'user_id',
        'metadata',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'configuration' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relacionamento com usuário criador.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para agentes ativos.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query): mixed
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope para agentes por tipo.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, string $type): mixed
    {
        return $query->where('type', $type);
    }

    /**
     * Verificar se o agente está ativo.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Ativar o agente.
     */
    public function activate(): bool
    {
        return $this->update(['status' => 'active']);
    }

    /**
     * Desativar o agente.
     */
    public function deactivate(): bool
    {
        return $this->update(['status' => 'inactive']);
    }

    /**
     * Obter configuração específica.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getConfigValue(string $key, $default = null): mixed
    {
        return data_get($this->configuration, $key, $default);
    }

    /**
     * Definir configuração específica.
     *
     * @param string $key
     * @param mixed $value
     */
    public function setConfigValue(string $key, $value): void
    {
        $config = $this->configuration ?? [];
        data_set($config, $key, $value);
        $this->update(['configuration' => $config]);
    }
}
