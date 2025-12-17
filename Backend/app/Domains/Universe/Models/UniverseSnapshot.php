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
 * @property array<string, mixed>|null $data
 * @property int $user_id
 * @property int|null $instance_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read User $user
 * @property-read UniverseInstance|null $instance
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class UniverseSnapshot extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'universe_snapshots';

    protected $fillable = [
        'name',
        'description',
        'data',
        'user_id',
        'instance_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relacionamento com o usuário criador.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relacionamento com a instância origem.
     */
    public function instance(): BelongsTo
    {
        return $this->belongsTo(UniverseInstance::class, 'instance_id');
    }

    /**
     * Scope para snapshots de uma instância específica.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $instanceId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForInstance($query, int $instanceId): mixed
    {
        return $query->where('instance_id', $instanceId);
    }

    /**
     * Verificar se o snapshot tem dados válidos.
     */
    public function hasValidData(): bool
    {
        return !empty($this->data);
    }

    /**
     * Obter tamanho dos dados em bytes.
     */
    public function getDataSize(): int
    {
        $encoded = json_encode($this->data);
        return $encoded !== false ? strlen($encoded) : 0;
    }
}
