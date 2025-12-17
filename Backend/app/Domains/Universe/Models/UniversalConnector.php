<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class UniversalConnector extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'universe_connectors';

    protected $fillable = [
        'name',
        'description',
        'type',
        'configuration',
        'status',
        'is_connected',
        'is_active',
        'category',
        'metrics',
        'last_sync_at',
        'next_sync',
        'last_error_at',
        'last_error_message',
        'metadata',
        'user_id',
    ];

    protected $casts = [
        'configuration' => 'array',
        'metadata' => 'array',
        'metrics' => 'array',
        'is_connected' => 'boolean',
        'is_active' => 'boolean',
        'last_sync_at' => 'datetime',
        'next_sync' => 'datetime',
        'last_error_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\UniversalConnectorFactory::new();
    }

    protected $appends = [
        'status_color',
        'status_text',
        'status_icon',
        'uptime_percentage',
        'success_rate_formatted'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function syncLogs(): HasMany
    {
        return $this->hasMany(ConnectorSyncLog::class, 'connector_id');
    }

    public function errors(): HasMany
    {
        return $this->hasMany(ConnectorError::class, 'connector_id');
    }

    // Accessors
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'connected' => 'green',
            'disconnected' => 'gray',
            'error' => 'red',
            'pending' => 'yellow',
            'syncing' => 'blue',
            default => 'gray'
        };
    }

    public function getStatusTextAttribute(): string
    {
        return match ($this->status) {
            'connected' => 'Connected',
            'disconnected' => 'Disconnected',
            'error' => 'Error',
            'pending' => 'Pending',
            'syncing' => 'Syncing',
            default => 'Unknown'
        };
    }

    public function getStatusIconAttribute(): string
    {
        return match ($this->status) {
            'connected' => 'check-circle',
            'disconnected' => 'x-circle',
            'error' => 'alert-circle',
            'pending' => 'clock',
            'syncing' => 'refresh-cw',
            default => 'circle'
        };
    }

    public function getUptimePercentageAttribute(): float
    {
        $metrics = $this->metrics ?? [];
        return $metrics['uptime'] ?? 0;
    }

    public function getSuccessRateFormattedAttribute(): string
    {
        $metrics = $this->metrics ?? [];
        $successRate = $metrics['success_rate'] ?? 0;
        return number_format($successRate, 1) . '%';
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

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    public function scopeConnected($query)
    {
        return $query->where('status', 'connected');
    }

    public function scopeWithErrors($query)
    {
        return $query->where('status', 'error');
    }

    // Methods
    public function connect(): void
    {
        $this->update([
            'status' => 'connected',
            'is_active' => true,
            'last_sync' => now()
        ]);
    }

    public function disconnect(): void
    {
        $this->update([
            'status' => 'disconnected',
            'is_active' => false
        ]);
    }

    public function markAsError(string $message): void
    {
        $this->update([
            'status' => 'error',
            'last_sync' => now()
        ]);

        // Log the error
        $this->errors()->create([
            'message' => $message,
            'error_type' => 'connection',
            'data' => ['error' => $message]
        ]);
    }

    public function startSync(): void
    {
        $this->update([
            'status' => 'syncing',
            'last_sync' => now()
        ]);
    }

    public function completeSync(bool $success = true, ?string $errorMessage = null): void
    {
        $status = $success ? 'connected' : 'error';

        $this->update([
            'status' => $status,
            'last_sync' => now(),
            'next_sync' => $this->calculateNextSync()
        ]);

        // Log the sync
        $this->syncLogs()->create([
            'status' => $success ? 'success' : 'failed',
            'message' => $success ? 'Sync completed successfully' : $errorMessage,
            'data' => [
                'success' => $success,
                'error' => $errorMessage,
                'sync_time' => now()
            ]
        ]);

        if (!$success && $errorMessage) {
            $this->markAsError($errorMessage);
        }
    }

    public function updateConfiguration(array $configuration): void
    {
        $this->update([
            'configuration' => $configuration,
            'last_sync' => now()
        ]);
    }

    public function updateMetrics(array $metrics): void
    {
        $this->update([
            'metrics' => $metrics,
            'last_sync' => now()
        ]);
    }

    public function incrementRequests(): void
    {
        $metrics = $this->metrics ?? [];
        $metrics['requests'] = ($metrics['requests'] ?? 0) + 1;
        $this->updateMetrics($metrics);
    }

    public function recordRequest(bool $success, float $responseTime): void
    {
        $metrics = $this->metrics ?? [];

        // Update request count
        $totalRequests = $metrics['requests'] ?? 0;
        $successfulRequests = $metrics['successful_requests'] ?? 0;

        if ($success) {
            $successfulRequests++;
        }

        $metrics['requests'] = $totalRequests + 1;
        $metrics['successful_requests'] = $successfulRequests;
        $metrics['success_rate'] = $totalRequests > 0 ? round(($successfulRequests / ($totalRequests + 1)) * 100, 2) : 0;

        // Update average response time
        $totalResponseTime = ($metrics['total_response_time'] ?? 0) + $responseTime;
        $metrics['total_response_time'] = $totalResponseTime;
        $metrics['avg_response_time'] = round($totalResponseTime / ($totalRequests + 1), 2);

        $this->updateMetrics($metrics);
    }

    public function calculateNextSync(): \DateTime
    {
        $configuration = $this->configuration ?? [];
        $syncFrequency = $configuration['sync_frequency'] ?? '1hour';

        return match ($syncFrequency) {
            'realtime' => now()->addMinutes(1),
            '15min' => now()->addMinutes(15),
            '30min' => now()->addMinutes(30),
            '1hour' => now()->addHour(),
            '6hours' => now()->addHours(6),
            '24hours' => now()->addDay(),
            default => now()->addHour()
        };
    }

    public function getTypeIcon(): string
    {
        return match ($this->type) {
            'api' => 'globe',
            'webhook' => 'webhook',
            'database' => 'database',
            'file' => 'file',
            'social' => 'share-2',
            'payment' => 'credit-card',
            'communication' => 'message-square',
            'productivity' => 'zap',
            default => 'link'
        };
    }

    public function getTypeColor(): string
    {
        return match ($this->type) {
            'api' => 'blue',
            'webhook' => 'purple',
            'database' => 'green',
            'file' => 'orange',
            'social' => 'pink',
            'payment' => 'red',
            'communication' => 'indigo',
            'productivity' => 'yellow',
            default => 'gray'
        };
    }

    public function getCategoryIcon(): string
    {
        return match ($this->category) {
            'E-commerce' => 'shopping-cart',
            'CRM' => 'users',
            'Communication' => 'message-square',
            'Database' => 'database',
            'Payment' => 'credit-card',
            'Productivity' => 'zap',
            'Social' => 'share-2',
            'Analytics' => 'bar-chart-3',
            default => 'box'
        };
    }

    public function getHealthStatus(): string
    {
        $metrics = $this->metrics ?? [];
        $successRate = $metrics['success_rate'] ?? 0;
        $uptime = $metrics['uptime'] ?? 0;

        if ($this->status === 'error') {
            return 'critical';
        }

        if ($successRate >= 95 && $uptime >= 99) {
            return 'excellent';
        } elseif ($successRate >= 90 && $uptime >= 95) {
            return 'good';
        } elseif ($successRate >= 80 && $uptime >= 90) {
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

    public function canSync(): bool
    {
        return $this->status === 'connected' && $this->is_active;
    }

    public function getLastSyncFormatted(): string
    {
        if (!$this->last_sync) {
            return 'Never';
        }

        $diff = now()->diffInMinutes($this->last_sync);

        if ($diff < 1) {
            return 'Just now';
        } elseif ($diff < 60) {
            return $diff . ' minutes ago';
        } elseif ($diff < 1440) {
            return round($diff / 60) . ' hours ago';
        } else {
            return round($diff / 1440) . ' days ago';
        }
    }

    public function getNextSyncFormatted(): string
    {
        if (!$this->next_sync) {
            return 'Not scheduled';
        }

        $diff = $this->next_sync->diffInMinutes(now());

        if ($diff < 1) {
            return 'Due now';
        } elseif ($diff < 60) {
            return 'In ' . $diff . ' minutes';
        } elseif ($diff < 1440) {
            return 'In ' . round($diff / 60) . ' hours';
        } else {
            return 'In ' . round($diff / 1440) . ' days';
        }
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        // Add computed fields
        $array['status_color'] = $this->status_color;
        $array['status_text'] = $this->status_text;
        $array['status_icon'] = $this->status_icon;
        $array['uptime_percentage'] = $this->uptime_percentage;
        $array['success_rate_formatted'] = $this->success_rate_formatted;
        $array['type_icon'] = $this->getTypeIcon();
        $array['type_color'] = $this->getTypeColor();
        $array['category_icon'] = $this->getCategoryIcon();
        $array['health_status'] = $this->getHealthStatus();
        $array['health_color'] = $this->getHealthColor();
        $array['last_sync_formatted'] = $this->getLastSyncFormatted();
        $array['next_sync_formatted'] = $this->getNextSyncFormatted();
        $array['can_sync'] = $this->canSync();

        return $array;
    }
}
