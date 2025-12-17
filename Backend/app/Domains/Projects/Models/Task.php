<?php

namespace App\Domains\Projects\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Task Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class Task extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    use BelongsToProject;

    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'type',
        'project_id',
        'assigned_to',
        'created_by',
        'parent_task_id',
        'tags',
        'attachments',
        'custom_fields',
        'estimated_hours',
        'actual_hours',
        'progress',
        'due_date',
        'started_at',
        'completed_at',
        'sort_order',
        'is_archived',
    ];

    protected $casts = [
        'tags' => 'array',
        'attachments' => 'array',
        'custom_fields' => 'array',
        'progress' => 'decimal:2',
        'due_date' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_archived' => 'boolean',
        'estimated_hours' => 'integer',
        'actual_hours' => 'integer',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
        'priority' => 'medium',
        'type' => 'task',
        'progress' => 0.00,
        'sort_order' => 0,
        'is_archived' => false,
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'assigned_to');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'created_by');
    }

    public function parentTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByAssignedTo($query, string $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeByCreatedBy($query, string $userId)
    {
        return $query->where('created_by', $userId);
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->whereNotIn('status', ['completed', 'cancelled']);
    }

    public function scopeDueSoon($query, int $days = 3)
    {
        return $query->whereBetween('due_date', [now(), now()->addDays($days)])
                    ->whereNotIn('status', ['completed', 'cancelled']);
    }

    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeWithSubtasks($query)
    {
        return $query->whereNull('parent_task_id');
    }

    public function scopeSubtasksOnly($query)
    {
        return $query->whereNotNull('parent_task_id');
    }

    // Accessors & Mutators
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pendente',
            'in_progress' => 'Em Progresso',
            'completed' => 'Concluída',
            'cancelled' => 'Cancelada',
            default => 'Desconhecido',
        };
    }

    public function getPriorityLabelAttribute(): string
    {
        return match ($this->priority) {
            'low' => 'Baixa',
            'medium' => 'Média',
            'high' => 'Alta',
            'urgent' => 'Urgente',
            default => 'Desconhecida',
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'task' => 'Tarefa',
            'bug' => 'Bug',
            'feature' => 'Funcionalidade',
            'improvement' => 'Melhoria',
            default => 'Desconhecido',
        };
    }

    public function getFormattedProgressAttribute(): string
    {
        return number_format($this->progress, 1) . '%';
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date && 
               $this->due_date < now() && 
               !in_array($this->status, ['completed', 'cancelled']);
    }

    public function getIsDueSoonAttribute(): bool
    {
        return $this->due_date && 
               $this->due_date <= now()->addDays(3) && 
               $this->due_date > now() &&
               !in_array($this->status, ['completed', 'cancelled']);
    }

    public function getHasSubtasksAttribute(): bool
    {
        return $this->subtasks()->count() > 0;
    }

    public function getIsSubtaskAttribute(): bool
    {
        return $this->parent_task_id !== null;
    }

    public function getEstimatedHoursFormattedAttribute(): ?string
    {
        return $this->estimated_hours ? $this->estimated_hours . 'h' : null;
    }

    public function getActualHoursFormattedAttribute(): ?string
    {
        return $this->actual_hours ? $this->actual_hours . 'h' : null;
    }

    // Methods
    public function start(): bool
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'in_progress';
        $this->started_at = now();
        return $this->save();
    }

    public function complete(): bool
    {
        if (!in_array($this->status, ['pending', 'in_progress'])) {
            return false;
        }

        $this->status = 'completed';
        $this->progress = 100.00;
        $this->completed_at = now();
        return $this->save();
    }

    public function cancel(): bool
    {
        if (in_array($this->status, ['completed', 'cancelled'])) {
            return false;
        }

        $this->status = 'cancelled';
        return $this->save();
    }

    public function archive(): bool
    {
        $this->is_archived = true;
        return $this->save();
    }

    public function unarchive(): bool
    {
        $this->is_archived = false;
        return $this->save();
    }

    public function updateProgress(float $progress): bool
    {
        if ($progress < 0 || $progress > 100) {
            return false;
        }

        $this->progress = $progress;
        
        if ($progress >= 100 && $this->status !== 'completed') {
            $this->complete();
        } elseif ($progress > 0 && $this->status === 'pending') {
            $this->start();
        }

        return $this->save();
    }

    public function assignTo(string $userId): bool
    {
        $this->assigned_to = $userId;
        return $this->save();
    }

    public function unassign(): bool
    {
        $this->assigned_to = null;
        return $this->save();
    }

    public function addTag(string $tag): bool
    {
        $tags = $this->tags ?? [];
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->tags = $tags;
            return $this->save();
        }
        return true;
    }

    public function removeTag(string $tag): bool
    {
        $tags = $this->tags ?? [];
        $tags = array_values(array_filter($tags, fn($t) => $t !== $tag));
        $this->tags = $tags;
        return $this->save();
    }

    public function hasTag(string $tag): bool
    {
        return in_array($tag, $this->tags ?? []);
    }

    public function addAttachment(string $name, string $path, int $size): bool
    {
        $attachments = $this->attachments ?? [];
        $attachments[] = [
            'name' => $name,
            'path' => $path,
            'size' => $size,
            'uploaded_at' => now()->toISOString(),
        ];
        $this->attachments = $attachments;
        return $this->save();
    }

    public function updateCustomField(string $key, $value): bool
    {
        $customFields = $this->custom_fields ?? [];
        $customFields[$key] = $value;
        $this->custom_fields = $customFields;
        return $this->save();
    }

    public function getCustomField(string $key, $default = null)
    {
        return data_get($this->custom_fields, $key, $default);
    }

    public function getDaysUntilDue(): ?int
    {
        if (!$this->due_date) {
            return null;
        }

        $now = now();
        if ($this->due_date < $now) {
            return 0;
        }

        return $now->diffInDays($this->due_date);
    }

    public function getDurationInDays(): ?int
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        return $this->started_at->diffInDays($this->completed_at);
    }

    public function getCompletionRate(): float
    {
        if (!$this->estimated_hours || $this->estimated_hours <= 0) {
            return 0.0;
        }

        $actualHours = $this->actual_hours ?? 0;
        return min(($actualHours / $this->estimated_hours) * 100, 100);
    }

    public function isAssignedTo(string $userId): bool
    {
        return $this->assigned_to === $userId;
    }

    public function isCreatedBy(string $userId): bool
    {
        return $this->created_by === $userId;
    }

    public function canBeStarted(): bool
    {
        return $this->status === 'pending';
    }

    public function canBeCompleted(): bool
    {
        return in_array($this->status, ['pending', 'in_progress']);
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->status, ['completed', 'cancelled']);
    }

    public function canBeArchived(): bool
    {
        return in_array($this->status, ['completed', 'cancelled']);
    }
}