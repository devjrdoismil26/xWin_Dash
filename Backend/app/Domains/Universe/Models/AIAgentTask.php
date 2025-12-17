<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIAgentTask extends Model
{
    use HasFactory;

    protected $table = 'universe_ai_agent_tasks';

    protected $fillable = [
        'agent_id',
        'user_id',
        'task_type',
        'title',
        'description',
        'input_data',
        'output_data',
        'status',
        'priority',
        'started_at',
        'completed_at',
        'response_time',
        'success',
        'error_message',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'input_data' => 'array',
        'output_data' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'response_time' => 'decimal:3',
        'success' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function agent(): BelongsTo
    {
        return $this->belongsTo(AISuperAgent::class, 'agent_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByAgent($query, $agentId)
    {
        return $query->where('agent_id', $agentId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByTaskType($query, $taskType)
    {
        return $query->where('task_type', $taskType);
    }

    public function scopeSuccessful($query)
    {
        return $query->where('success', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('success', false);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Methods
    public function start(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now()
        ]);
    }

    public function complete(array $outputData, bool $success = true, ?string $errorMessage = null): void
    {
        $responseTime = $this->started_at ? now()->diffInMilliseconds($this->started_at) / 1000 : 0;

        $this->update([
            'status' => 'completed',
            'output_data' => $outputData,
            'success' => $success,
            'error_message' => $errorMessage,
            'completed_at' => now(),
            'response_time' => $responseTime
        ]);

        // Update agent metrics
        if ($this->agent) {
            $this->agent->recordTaskCompletion($success, $responseTime);
        }
    }

    public function fail(string $errorMessage): void
    {
        $this->complete([], false, $errorMessage);
    }

    public function getStatusColor(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'running' => 'blue',
            'completed' => 'green',
            'failed' => 'red',
            'cancelled' => 'gray',
            default => 'gray'
        };
    }

    public function getStatusText(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'running' => 'Running',
            'completed' => 'Completed',
            'failed' => 'Failed',
            'cancelled' => 'Cancelled',
            default => 'Unknown'
        };
    }

    public function getPriorityColor(): string
    {
        return match ($this->priority) {
            'low' => 'green',
            'medium' => 'yellow',
            'high' => 'red',
            'urgent' => 'purple',
            default => 'gray'
        };
    }

    public function getPriorityText(): string
    {
        return match ($this->priority) {
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'urgent' => 'Urgent',
            default => 'Unknown'
        };
    }

    public function getDuration(): ?float
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        return $this->completed_at->diffInSeconds($this->started_at);
    }

    public function getFormattedDuration(): ?string
    {
        $duration = $this->getDuration();
        if (!$duration) {
            return null;
        }

        if ($duration < 60) {
            return round($duration, 2) . 's';
        } elseif ($duration < 3600) {
            return round($duration / 60, 2) . 'm';
        } else {
            return round($duration / 3600, 2) . 'h';
        }
    }

    public function isRunning(): bool
    {
        return $this->status === 'running';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function isSuccessful(): bool
    {
        return $this->isCompleted() && $this->success;
    }
}
