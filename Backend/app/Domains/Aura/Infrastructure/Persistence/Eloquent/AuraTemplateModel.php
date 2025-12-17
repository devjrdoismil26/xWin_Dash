<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * AuraTemplateModel
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 * 
 * @property string $id
 * @property string $connection_id
 * @property string $name
 * @property string $type
 * @property array $content
 * @property array $variables
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraTemplateModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'aura_templates';

    protected $fillable = [
        'connection_id',
        'name',
        'language',
        'category',
        'content',
        'components',
        'variables',
        'status',
        'whatsapp_template_id',
        'rejection_reason',
        'usage_count',
        'project_id',
        'created_by',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'components' => 'array',
        'variables' => 'array',
        'usage_count' => 'integer',
    ];

    /**
     * @return BelongsTo<AuraConnectionModel, AuraTemplateModel>
     */
    public function connection(): BelongsTo
    {
        return $this->belongsTo(AuraConnectionModel::class, 'connection_id');
    }
}
