<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AuraFlowModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 * 
 * @property string $id
 * @property string $connection_id
 * @property string $name
 * @property string|null $description
 * @property array $structure
 * @property string $status
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraFlowModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'aura_flows';

    protected $fillable = [
        'connection_id',
        'name',
        'description',
        'is_active',
        'triggers',
        'structure',
        'variables',
        'execution_count',
        'last_executed_at',
        'project_id',
        'created_by',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'triggers' => 'array',
        'structure' => 'array',
        'variables' => 'array',
        'is_active' => 'boolean',
        'execution_count' => 'integer',
        'last_executed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<AuraConnectionModel, AuraFlowModel>
     */
    public function connection(): BelongsTo
    {
        return $this->belongsTo(AuraConnectionModel::class, 'connection_id');
    }

    /**
     * @return HasMany<AuraFlowNodeModel>
     */
    public function nodes(): HasMany
    {
        return $this->hasMany(AuraFlowNodeModel::class, 'flow_id');
    }

    /**
     * @return HasMany<AuraFlowExecutionModel>
     */
    public function executions(): HasMany
    {
        return $this->hasMany(AuraFlowExecutionModel::class, 'flow_id');
    }
}
