<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * UniverseInstance Model
 * 
 * SECURITY FIX (MODEL-006): Adicionado BelongsToProject trait para multi-tenancy
 * 
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property string $status
 * @property array<string, mixed>|null $configuration
 * @property string $user_id
 * @property string|null $template_id
 * @property string|null $project_id
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read User $user
 * @property-read UniverseTemplate|null $template
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $sharedUsers
 * @property-read \Illuminate\Database\Eloquent\Collection<int, UniverseSnapshot> $snapshots
 * @property-read \Illuminate\Database\Eloquent\Collection<int, UniverseAnalytics> $analytics
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class UniverseInstance extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;
    use BelongsToProject;

    protected $table = 'universe_instances';

    protected $fillable = [
        'name',
        'description',
        'status',
        'configuration',
        'user_id',
        'template_id',
        'project_id',
        'metadata',
        'is_active',
        'is_default',
        'modules_config',
        'blocks_config',
        'canvas_state',
        'permissions',
        'quota_limits',
        'performance_config',
        'connections_config',
        'layout_config',
        'theme_config',
        'performance_metrics',
        'usage_stats',
        'ai_insights',
        'last_accessed_at',
        'version',
    ];

    /**
     * @var array<string>
     */
    protected $visible = [
        'id',
        'name',
        'description',
        'status',
        'configuration',
        'user_id',
        'created_at',
        'updated_at'
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'configuration' => 'array',
        'metadata' => 'array',
        'modules_config' => 'array',
        'blocks_config' => 'array',
        'canvas_state' => 'array',
        'permissions' => 'array',
        'quota_limits' => 'array',
        'performance_config' => 'array',
        'connections_config' => 'array',
        'layout_config' => 'array',
        'theme_config' => 'array',
        'performance_metrics' => 'array',
        'usage_stats' => 'array',
        'ai_insights' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'last_accessed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relacionamento com o usuário proprietário.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relacionamento com template base.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(UniverseTemplate::class, 'template_id');
    }

    /**
     * Relacionamento com usuários compartilhados.
     */
    public function sharedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'universe_instance_users')
                    ->withPivot('permission', 'shared_at')
                    ->withTimestamps();
    }

    /**
     * Relacionamento com snapshots.
     */
    public function snapshots(): HasMany
    {
        return $this->hasMany(UniverseSnapshot::class, 'instance_id');
    }

    /**
     * Relacionamento com analytics.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(UniverseAnalytics::class, 'instance_id');
    }

    /**
     * Relacionamento com blocks.
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(UniverseBlock::class, 'instance_id');
    }

    /**
     * Relacionamento com project.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Projects\Models\Project::class, 'project_id');
    }

    /**
     * Scope para instâncias ativas.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query): mixed
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para instâncias por usuário.
     */
    public function scopeByUser($query, int $userId): mixed
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope para instâncias recentes.
     */
    public function scopeRecent($query, int $days = 7): mixed
    {
        return $query->where('last_accessed_at', '>=', now()->subDays($days));
    }

    /**
     * Scope para instâncias de um projeto.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $projectId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeProject($query, string $projectId): mixed
    {
        return $query->where('project_id', $projectId);
    }

    /**
     * Verificar se a instância está ativa.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Ativar a instância.
     */
    public function activate(): bool
    {
        return $this->update(['status' => 'active']);
    }

    /**
     * Desativar a instância.
     */
    public function deactivate(): bool
    {
        return $this->update(['status' => 'inactive']);
    }

    /**
     * Verificar se usuário tem acesso à instância.
     */
    public function hasUserAccess(User $user): bool
    {
        if ((int) $this->user_id === (int) $user->id) {
            return true;
        }

        return $this->sharedUsers->contains('id', $user->id);
    }

    /**
     * Compartilhar instância com usuário.
     */
    public function shareWith(User $user, string $permission = 'view'): void
    {
        $this->sharedUsers()->syncWithoutDetaching([
            $user->id => [
                'permission' => $permission,
                'shared_at' => now(),
            ]
        ]);
    }

    /**
     * Remover compartilhamento com usuário.
     */
    public function unshareWith(User $user): void
    {
        $this->sharedUsers()->detach($user->id);
    }

    /**
     * Adicionar block à instância.
     */
    public function addBlock(string $blockType, array $config): UniverseBlock
    {
        return $this->blocks()->create([
            'block_type' => $blockType,
            'config' => $config,
            'position' => $config['position'] ?? ['x' => 0, 'y' => 0],
            'is_active' => true,
        ]);
    }

    /**
     * Remover block da instância.
     */
    public function removeBlock(string $blockId): bool
    {
        return $this->blocks()->where('id', $blockId)->delete();
    }

    /**
     * Salvar estado do canvas.
     */
    public function saveCanvasState(array $state): bool
    {
        $this->canvas_state = $state;
        return $this->save();
    }

    /**
     * Criar snapshot da instância.
     */
    public function createSnapshot(string $name): UniverseSnapshot
    {
        return $this->snapshots()->create([
            'name' => $name,
            'snapshot_data' => [
                'blocks' => $this->blocks->toArray(),
                'canvas_state' => $this->canvas_state,
                'config' => $this->configuration,
            ],
            'version' => $this->version ?? '1.0.0',
            'created_by' => auth()->id(),
        ]);
    }

    /**
     * Restaurar snapshot.
     */
    public function restoreSnapshot(string $snapshotId): bool
    {
        $snapshot = $this->snapshots()->findOrFail($snapshotId);
        
        \DB::transaction(function () use ($snapshot) {
            $this->blocks()->delete();
            
            foreach ($snapshot->snapshot_data['blocks'] ?? [] as $blockData) {
                $this->blocks()->create($blockData);
            }
            
            $this->canvas_state = $snapshot->snapshot_data['canvas_state'] ?? [];
            $this->configuration = $snapshot->snapshot_data['config'] ?? [];
            $this->save();
        });
        
        return true;
    }
}
