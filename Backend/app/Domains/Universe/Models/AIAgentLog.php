<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIAgentLog extends Model
{
    use HasFactory;

    protected $table = 'universe_ai_agent_logs';

    protected $fillable = [
        'agent_id',
        'level',
        'message',
        'data',
        'context',
        'created_at'
    ];

    protected $casts = [
        'data' => 'array',
        'context' => 'array',
        'created_at' => 'datetime'
    ];

    // Relationships
    public function agent(): BelongsTo
    {
        return $this->belongsTo(AISuperAgent::class, 'agent_id');
    }

    // Scopes
    public function scopeByAgent($query, $agentId)
    {
        return $query->where('agent_id', $agentId);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    public function scopeInfo($query)
    {
        return $query->where('level', 'info');
    }

    public function scopeWarning($query)
    {
        return $query->where('level', 'warning');
    }

    public function scopeError($query)
    {
        return $query->where('level', 'error');
    }

    public function scopeDebug($query)
    {
        return $query->where('level', 'debug');
    }

    public function scopeRecent($query, $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    // Methods
    public function getLevelColor(): string
    {
        return match ($this->level) {
            'debug' => 'gray',
            'info' => 'blue',
            'warning' => 'yellow',
            'error' => 'red',
            'critical' => 'purple',
            default => 'gray'
        };
    }

    public function getLevelIcon(): string
    {
        return match ($this->level) {
            'debug' => 'bug',
            'info' => 'info',
            'warning' => 'alert-triangle',
            'error' => 'x-circle',
            'critical' => 'alert-circle',
            default => 'circle'
        };
    }

    public function getFormattedMessage(): string
    {
        $data = $this->data ?? [];
        $message = $this->message;

        // Replace placeholders with data values
        foreach ($data as $key => $value) {
            $message = str_replace("{{$key}}", $value, $message);
        }

        return $message;
    }

    public function getContextSummary(): string
    {
        $context = $this->context ?? [];

        if (empty($context)) {
            return 'No context';
        }

        $summary = [];
        foreach ($context as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            $summary[] = "$key: $value";
        }

        return implode(', ', $summary);
    }
}
