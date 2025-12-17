<?php

namespace App\Domains\Projects\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectActivity extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'project_activities';

    protected $fillable = [
        'project_id',
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'description',
        'old_values',
        'new_values',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class);
    }

    // Scopes
    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByEntityType($query, string $entityType)
    {
        return $query->where('entity_type', $entityType);
    }

    public function scopeByEntity($query, string $entityType, string $entityId)
    {
        return $query->where('entity_type', $entityType)
                    ->where('entity_id', $entityId);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
    }

    // Accessors & Mutators
    public function getActionLabelAttribute(): string
    {
        return match ($this->action) {
            'created' => 'Criado',
            'updated' => 'Atualizado',
            'deleted' => 'Excluído',
            'status_changed' => 'Status Alterado',
            'member_added' => 'Membro Adicionado',
            'member_removed' => 'Membro Removido',
            'member_role_changed' => 'Função do Membro Alterada',
            'setting_changed' => 'Configuração Alterada',
            'task_created' => 'Tarefa Criada',
            'task_updated' => 'Tarefa Atualizada',
            'task_completed' => 'Tarefa Concluída',
            'task_assigned' => 'Tarefa Atribuída',
            'comment_added' => 'Comentário Adicionado',
            'file_uploaded' => 'Arquivo Enviado',
            'file_downloaded' => 'Arquivo Baixado',
            default => ucfirst(str_replace('_', ' ', $this->action)),
        };
    }

    public function getEntityTypeLabelAttribute(): string
    {
        return match ($this->entity_type) {
            'project' => 'Projeto',
            'task' => 'Tarefa',
            'member' => 'Membro',
            'setting' => 'Configuração',
            'comment' => 'Comentário',
            'file' => 'Arquivo',
            'template' => 'Template',
            default => ucfirst($this->entity_type ?? 'Item'),
        };
    }

    public function getFormattedDescriptionAttribute(): string
    {
        $userName = $this->user->name ?? 'Usuário';
        $actionLabel = $this->action_label;
        $entityLabel = $this->entity_type_label;

        return "{$userName} {$actionLabel} {$entityLabel}";
    }

    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    public function getHasChangesAttribute(): bool
    {
        return !empty($this->old_values) || !empty($this->new_values);
    }

    public function getChangesSummaryAttribute(): string
    {
        if (!$this->has_changes) {
            return '';
        }

        $changes = [];
        
        if (!empty($this->old_values) && !empty($this->new_values)) {
            foreach ($this->new_values as $key => $newValue) {
                $oldValue = $this->old_values[$key] ?? null;
                if ($oldValue !== $newValue) {
                    $changes[] = "{$key}: {$oldValue} → {$newValue}";
                }
            }
        } elseif (!empty($this->new_values)) {
            foreach ($this->new_values as $key => $value) {
                $changes[] = "{$key}: {$value}";
            }
        }

        return implode(', ', $changes);
    }

    // Methods
    public function getMetadata(string $key, $default = null)
    {
        return data_get($this->metadata, $key, $default);
    }

    public function setMetadata(string $key, $value): bool
    {
        $metadata = $this->metadata ?? [];
        data_set($metadata, $key, $value);
        $this->metadata = $metadata;
        return $this->save();
    }

    public function addMetadata(array $data): bool
    {
        $metadata = $this->metadata ?? [];
        $metadata = array_merge($metadata, $data);
        $this->metadata = $metadata;
        return $this->save();
    }

    public function getOldValue(string $key, $default = null)
    {
        return data_get($this->old_values, $key, $default);
    }

    public function getNewValue(string $key, $default = null)
    {
        return data_get($this->new_values, $key, $default);
    }

    public function hasValueChanged(string $key): bool
    {
        $oldValue = $this->getOldValue($key);
        $newValue = $this->getNewValue($key);
        return $oldValue !== $newValue;
    }

    public function isCreated(): bool
    {
        return $this->action === 'created';
    }

    public function isUpdated(): bool
    {
        return $this->action === 'updated';
    }

    public function isDeleted(): bool
    {
        return $this->action === 'deleted';
    }

    public function isStatusChanged(): bool
    {
        return $this->action === 'status_changed';
    }

    public function isMemberAction(): bool
    {
        return in_array($this->action, ['member_added', 'member_removed', 'member_role_changed']);
    }

    public function isTaskAction(): bool
    {
        return in_array($this->action, ['task_created', 'task_updated', 'task_completed', 'task_assigned']);
    }

    public function isFileAction(): bool
    {
        return in_array($this->action, ['file_uploaded', 'file_downloaded']);
    }

    public function isRecent(int $minutes = 60): bool
    {
        return $this->created_at->isAfter(now()->subMinutes($minutes));
    }

    public function isToday(): bool
    {
        return $this->created_at->isToday();
    }

    public function isThisWeek(): bool
    {
        return $this->created_at->isCurrentWeek();
    }

    public function isThisMonth(): bool
    {
        return $this->created_at->isCurrentMonth();
    }

    // Static methods
    public static function logActivity(
        string $projectId,
        string $userId,
        string $action,
        string $description,
        string $entityType = null,
        string $entityId = null,
        array $oldValues = null,
        array $newValues = null,
        array $metadata = null,
        string $ipAddress = null,
        string $userAgent = null
    ): self {
        return static::create([
            'project_id' => $projectId,
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => $metadata,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    public static function getProjectActivity(string $projectId, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return static::byProject($projectId)
                    ->with('user:id,name,email')
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
    }

    public static function getUserActivity(string $userId, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return static::byUser($userId)
                    ->with('project:id,name')
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
    }

    public static function getRecentActivity(int $days = 7, int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return static::recent($days)
                    ->with(['user:id,name,email', 'project:id,name'])
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
    }

    public static function getActivityByEntity(string $entityType, string $entityId): \Illuminate\Database\Eloquent\Collection
    {
        return static::byEntity($entityType, $entityId)
                    ->with(['user:id,name,email', 'project:id,name'])
                    ->orderBy('created_at', 'desc')
                    ->get();
    }

    public static function getActivityStats(string $projectId, int $days = 30): array
    {
        $activities = static::byProject($projectId)
                          ->recent($days)
                          ->get();

        return [
            'total_activities' => $activities->count(),
            'unique_users' => $activities->pluck('user_id')->unique()->count(),
            'actions_count' => $activities->groupBy('action')->map->count(),
            'entity_types_count' => $activities->groupBy('entity_type')->map->count(),
            'daily_activity' => $activities->groupBy(function ($activity) {
                return $activity->created_at->format('Y-m-d');
            })->map->count(),
        ];
    }
}