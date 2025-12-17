<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\User;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;

class LeadModel extends Model
{
    use SoftDeletes;
    use HasUuids;

    protected $table = 'leads';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'position',
        'website',
        'notes',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'address',
        'status',
        'score',
        'last_activity_at',
        'converted_at',
        'value',
        'assigned_to',
        'project_id',
    ];

    protected $casts = [
        'address' => 'array',
        'last_activity_at' => 'datetime',
        'converted_at' => 'datetime',
        'value' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
    }

    public function scopeHighScore($query, $minScore = 70)
    {
        return $query->where('score', '>=', $minScore);
    }

    /**
     * Converte para entidade de domínio (método temporário para compatibilidade)
     */
    public function toDomainEntity()
    {
        return $this; // Por enquanto retorna o próprio model
    }
}
