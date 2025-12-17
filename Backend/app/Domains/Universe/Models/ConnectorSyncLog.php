<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConnectorSyncLog extends Model
{
    use HasFactory;

    protected $table = 'universe_connector_sync_logs';

    protected $fillable = [
        'connector_id',
        'status',
        'message',
        'data',
        'sync_time',
        'records_processed',
        'records_successful',
        'records_failed',
        'created_at'
    ];

    protected $casts = [
        'data' => 'array',
        'sync_time' => 'datetime',
        'records_processed' => 'integer',
        'records_successful' => 'integer',
        'records_failed' => 'integer',
        'created_at' => 'datetime'
    ];

    // Relationships
    public function connector(): BelongsTo
    {
        return $this->belongsTo(UniversalConnector::class, 'connector_id');
    }

    // Scopes
    public function scopeByConnector($query, $connectorId)
    {
        return $query->where('connector_id', $connectorId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeRecent($query, $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    // Methods
    public function getStatusColor(): string
    {
        return match ($this->status) {
            'success' => 'green',
            'failed' => 'red',
            'partial' => 'yellow',
            'running' => 'blue',
            default => 'gray'
        };
    }

    public function getStatusIcon(): string
    {
        return match ($this->status) {
            'success' => 'check-circle',
            'failed' => 'x-circle',
            'partial' => 'alert-triangle',
            'running' => 'refresh-cw',
            default => 'circle'
        };
    }

    public function getSuccessRate(): float
    {
        if ($this->records_processed === 0) {
            return 0;
        }

        return round(($this->records_successful / $this->records_processed) * 100, 2);
    }

    public function getFailureRate(): float
    {
        if ($this->records_processed === 0) {
            return 0;
        }

        return round(($this->records_failed / $this->records_processed) * 100, 2);
    }

    public function getDuration(): ?float
    {
        if (!$this->sync_time) {
            return null;
        }

        return now()->diffInSeconds($this->sync_time);
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
}
