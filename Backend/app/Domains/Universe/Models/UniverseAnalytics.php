<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $metric_name
 * @property mixed $value
 * @property \Illuminate\Support\Carbon $timestamp
 * @property int|null $instance_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read User $user
 * @property-read UniverseInstance|null $instance
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class UniverseAnalytics extends Model
{
    use HasFactory;

    protected $table = 'universe_analytics';

    protected $fillable = [
        'metric_name',
        'value',
        'timestamp',
        'instance_id',
        'user_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'timestamp' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relacionamento com a instância do universo.
     */
    public function instance(): BelongsTo
    {
        return $this->belongsTo(UniverseInstance::class, 'instance_id');
    }

    /**
     * Relacionamento com o usuário.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope para métricas específicas.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $metricName
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMetric($query, string $metricName): mixed
    {
        return $query->where('metric_name', $metricName);
    }

    /**
     * Scope para período específico.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \Illuminate\Support\Carbon $start
     * @param \Illuminate\Support\Carbon $end
     * @return mixed
     */
    public function scopePeriod($query, $start, $end): mixed
    {
        return $query->whereBetween('timestamp', [$start, $end]);
    }

    /**
     * Scope para instância específica.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $instanceId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForInstance($query, int $instanceId): mixed
    {
        return $query->where('instance_id', $instanceId);
    }
}
