<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AISuperAgent extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'universe_ai_super_agents';

    protected $fillable = [
        'name',
        'type',
        'description',
        'status',
        'performance',
        'metrics',
        'capabilities',
        'is_premium',
        'is_active',
        'configuration',
        'user_id',
        'last_activity',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'performance' => 'array',
        'metrics' => 'array',
        'capabilities' => 'array',
        'configuration' => 'array',
        'is_premium' => 'boolean',
        'is_active' => 'boolean',
        'last_activity' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $appends = [
        'status_color',
        'status_text',
        'performance_score',
        'efficiency_score'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(AIAgentTask::class, 'agent_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(AIAgentLog::class, 'agent_id');
    }

    // Accessors
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'active' => 'green',
            'inactive' => 'gray',
            'training' => 'blue',
            'error' => 'red',
            default => 'gray'
        };
    }

    public function getStatusTextAttribute(): string
    {
        return match ($this->status) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'training' => 'Training',
            'error' => 'Error',
            default => 'Unknown'
        };
    }

    public function getPerformanceScoreAttribute(): float
    {
        $performance = $this->performance ?? [];
        $accuracy = $performance['accuracy'] ?? 0;
        $speed = $performance['speed'] ?? 0;
        $efficiency = $performance['efficiency'] ?? 0;
        $uptime = $performance['uptime'] ?? 0;

        return round(($accuracy + $speed + $efficiency + $uptime) / 4, 2);
    }

    public function getEfficiencyScoreAttribute(): float
    {
        $metrics = $this->metrics ?? [];
        $successRate = $metrics['success_rate'] ?? 0;
        $avgResponseTime = $metrics['avg_response_time'] ?? 0;

        // Calculate efficiency based on success rate and response time
        $responseScore = max(0, 100 - ($avgResponseTime / 10)); // Penalize slow responses
        return round(($successRate + $responseScore) / 2, 2);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeHighPerformance($query)
    {
        return $query->whereRaw('JSON_EXTRACT(performance, "$.accuracy") > 90');
    }

    // Methods
    public function start(): void
    {
        $this->update([
            'status' => 'active',
            'is_active' => true,
            'last_activity' => now()
        ]);
    }

    public function stop(): void
    {
        $this->update([
            'status' => 'inactive',
            'is_active' => false,
            'last_activity' => now()
        ]);
    }

    public function restart(): void
    {
        $this->update([
            'status' => 'active',
            'is_active' => true,
            'last_activity' => now()
        ]);
    }

    public function markAsError(string $message): void
    {
        $this->update([
            'status' => 'error',
            'last_activity' => now()
        ]);

        // Log the error
        $this->logs()->create([
            'level' => 'error',
            'message' => $message,
            'data' => ['error' => $message]
        ]);
    }

    public function updatePerformance(array $performance): void
    {
        $this->update([
            'performance' => $performance,
            'last_activity' => now()
        ]);
    }

    public function updateMetrics(array $metrics): void
    {
        $this->update([
            'metrics' => $metrics,
            'last_activity' => now()
        ]);
    }

    public function updateConfiguration(array $configuration): void
    {
        $this->update([
            'configuration' => $configuration,
            'last_activity' => now()
        ]);
    }

    public function incrementTaskCount(): void
    {
        $metrics = $this->metrics ?? [];
        $metrics['tasks_completed'] = ($metrics['tasks_completed'] ?? 0) + 1;
        $this->updateMetrics($metrics);
    }

    public function recordTaskCompletion(bool $success, float $responseTime): void
    {
        $metrics = $this->metrics ?? [];

        // Update success rate
        $totalTasks = $metrics['tasks_completed'] ?? 0;
        $successfulTasks = $metrics['successful_tasks'] ?? 0;

        if ($success) {
            $successfulTasks++;
        }

        $metrics['successful_tasks'] = $successfulTasks;
        $metrics['success_rate'] = $totalTasks > 0 ? round(($successfulTasks / $totalTasks) * 100, 2) : 0;

        // Update average response time
        $totalResponseTime = ($metrics['total_response_time'] ?? 0) + $responseTime;
        $metrics['total_response_time'] = $totalResponseTime;
        $metrics['avg_response_time'] = $totalTasks > 0 ? round($totalResponseTime / $totalTasks, 2) : 0;

        $this->updateMetrics($metrics);
        $this->incrementTaskCount();
    }

    public function getTypeIcon(): string
    {
        return match ($this->type) {
            'marketing' => 'target',
            'sales' => 'dollar-sign',
            'analytics' => 'bar-chart-3',
            'security' => 'shield',
            'support' => 'message-square',
            'content' => 'share-2',
            default => 'brain'
        };
    }

    public function getTypeColor(): string
    {
        return match ($this->type) {
            'marketing' => 'blue',
            'sales' => 'green',
            'analytics' => 'purple',
            'security' => 'red',
            'support' => 'orange',
            'content' => 'pink',
            default => 'gray'
        };
    }

    public function getHealthStatus(): string
    {
        $performance = $this->performance ?? [];
        $accuracy = $performance['accuracy'] ?? 0;
        $uptime = $performance['uptime'] ?? 0;

        if ($this->status === 'error') {
            return 'critical';
        }

        if ($accuracy >= 95 && $uptime >= 99) {
            return 'excellent';
        } elseif ($accuracy >= 90 && $uptime >= 95) {
            return 'good';
        } elseif ($accuracy >= 80 && $uptime >= 90) {
            return 'fair';
        } else {
            return 'poor';
        }
    }

    public function getHealthColor(): string
    {
        return match ($this->getHealthStatus()) {
            'excellent' => 'green',
            'good' => 'blue',
            'fair' => 'yellow',
            'poor' => 'orange',
            'critical' => 'red',
            default => 'gray'
        };
    }

    public function canPerformTask(string $taskType): bool
    {
        $capabilities = $this->capabilities ?? [];
        return in_array($taskType, $capabilities);
    }

    public function getRecommendedTasks(): array
    {
        $type = $this->type;
        $capabilities = $this->capabilities ?? [];

        $recommendations = [];

        switch ($type) {
            case 'marketing':
                $recommendations = [
                    'Campaign Optimization',
                    'Content Generation',
                    'A/B Testing',
                    'Audience Analysis'
                ];
                break;
            case 'sales':
                $recommendations = [
                    'Lead Scoring',
                    'Sales Forecasting',
                    'Pipeline Management',
                    'Follow-up Automation'
                ];
                break;
            case 'analytics':
                $recommendations = [
                    'Data Analysis',
                    'Report Generation',
                    'Trend Detection',
                    'Performance Insights'
                ];
                break;
            case 'security':
                $recommendations = [
                    'Threat Detection',
                    'Vulnerability Scanning',
                    'Access Control',
                    'Audit Logging'
                ];
                break;
            case 'support':
                $recommendations = [
                    'Ticket Resolution',
                    'FAQ Automation',
                    'Sentiment Analysis',
                    'Customer Satisfaction'
                ];
                break;
            case 'content':
                $recommendations = [
                    'Content Generation',
                    'SEO Optimization',
                    'Plagiarism Check',
                    'Tone Analysis'
                ];
                break;
        }

        return array_intersect($recommendations, $capabilities);
    }

    public function getPerformanceTrend(): string
    {
        $metrics = $this->metrics ?? [];
        $successRate = $metrics['success_rate'] ?? 0;

        if ($successRate >= 95) {
            return 'excellent';
        } elseif ($successRate >= 90) {
            return 'good';
        } elseif ($successRate >= 80) {
            return 'fair';
        } else {
            return 'needs_improvement';
        }
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        // Add computed fields
        $array['status_color'] = $this->status_color;
        $array['status_text'] = $this->status_text;
        $array['performance_score'] = $this->performance_score;
        $array['efficiency_score'] = $this->efficiency_score;
        $array['type_icon'] = $this->getTypeIcon();
        $array['type_color'] = $this->getTypeColor();
        $array['health_status'] = $this->getHealthStatus();
        $array['health_color'] = $this->getHealthColor();
        $array['recommended_tasks'] = $this->getRecommendedTasks();
        $array['performance_trend'] = $this->getPerformanceTrend();

        return $array;
    }
}
