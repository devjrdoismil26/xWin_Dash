<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Services\AuraFlowService;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Aura\Models\AuraFlowNode.
 *
 * @property string $id
 * @property string $aura_flow_id
 * @property string $type
 * @property array $config
 * @property int $order_sequence
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $parent_node_id
 * @property \Illuminate\Database\Eloquent\Collection<int, AuraFlowNode> $children
 * @property int|null $children_count
 * @property \App\Domains\Aura\Models\AuraFlow $flow
 * @property AuraFlowNode|null $parent
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Domains\Aura\Models\AuraUraSession> $uraSessions
 * @property int|null $ura_sessions_count
 *
 * @method static \Database\Factories\Aura\AuraFlowNodeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode query()
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereAuraFlowId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereOrderSequence($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereParentNodeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|AuraFlowNode withoutTrashed()
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraFlowNodeModel extends Model
{
    use HasUuids;
    use SoftDeletes;
    use HasFactory;

    protected static function newFactory(): \Database\Factories\Aura\AuraFlowNodeFactory
    {
        return \Database\Factories\Aura\AuraFlowNodeFactory::new();
    }

    /**
     * Define os tipos de nós de fluxo válidos.
     *
     * @var array<int, string>
     */
    public const VALID_TYPES = [
        'start', 'message', 'question', 'condition', 'transfer_to_human', 'end',
        // Adicionar outros tipos de nós conforme necessário (ex: 'api_call', 'lead_update', etc.)
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'aura_flow_id',
        'type',
        'config',
        'parent_node_id',
        'order_sequence',
        'connections',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'config' => 'array',
        'connections' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function (AuraFlowNodeModel $node) {
            // Validação do tipo de nó
            if (!in_array($node->type, self::VALID_TYPES)) {
                throw new \Exception('Tipo de nó de fluxo inválido: ' . $node->type);
            }

            // [Melhoria Futura] Adicionar validação mais rigorosa para a estrutura de 'config' e 'connections'
            // com base no tipo de nó (ex: JSON Schema ou classes de configuração dedicadas).
            // A validação atual é básica e garante apenas a existência dos campos.
        });
    }

    /**
     * Get the flow that owns the node.
     *
     * @return BelongsTo<AuraFlowModel, AuraFlowNodeModel>
     */
    public function flow(): BelongsTo
    {
        return $this->belongsTo(AuraFlowModel::class, 'flow_id');
    }

    /**
     * Get the parent node.
     *
     * @return BelongsTo<AuraFlowNodeModel, AuraFlowNodeModel>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(AuraFlowNodeModel::class, 'parent_node_id');
    }

    /**
     * Get the child nodes.
     *
     * @return HasMany<AuraFlowNodeModel>
     */
    public function children(): HasMany
    {
        return $this->hasMany(AuraFlowNodeModel::class, 'parent_node_id')
                    ->orderBy('order');
    }

    /**
     * Get the URA sessions at this node.
     *
     * @return HasMany<AuraUraSessionModel>
     */
    public function uraSessions(): HasMany
    {
        return $this->hasMany(AuraUraSessionModel::class, 'current_node_id');
    }

    /**
     * Retorna o ID do próximo nó com base em uma condição (se aplicável).
     * Esta é uma lógica auxiliar; a lógica principal de execução está no AuraFlowService.
     *
     * @param string|null $condition a condição para a qual buscar a conexão (ex: 'true', 'false', 'option_1')
     *
     * @return string|null o ID do próximo nó ou null se não houver correspondência
     */
    public function getNextNodeId(?string $condition = null): ?string
    {
        if (empty($this->connections)) {
            return null;
        }

        // Para nós com múltiplas saídas baseadas em condição (ex: 'condition' node)
        if ($this->type === 'condition' && $condition !== null) {
            foreach ($this->connections as $connection) {
                if (isset($connection['condition']) && $connection['condition'] === $condition) {
                    return $connection['target_node_id'];
                }
            }
        }

        // Para nós com uma única saída padrão ou a primeira saída disponível
        return $this->connections[0]['target_node_id'] ?? null;
    }
}
