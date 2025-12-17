<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConnectorError extends Model
{
    use HasFactory;

    protected $table = 'universe_connector_errors';

    protected $fillable = [
        'connector_id',
        'error_type',
        'message',
        'data',
        'resolved',
        'resolved_at',
        'created_at'
    ];

    protected $casts = [
        'data' => 'array',
        'resolved' => 'boolean',
        'resolved_at' => 'datetime',
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

    public function scopeByErrorType($query, $errorType)
    {
        return $query->where('error_type', $errorType);
    }

    public function scopeResolved($query)
    {
        return $query->where('resolved', true);
    }

    public function scopeUnresolved($query)
    {
        return $query->where('resolved', false);
    }

    public function scopeRecent($query, $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    // Methods
    public function resolve(): void
    {
        $this->update([
            'resolved' => true,
            'resolved_at' => now()
        ]);
    }

    public function getErrorTypeColor(): string
    {
        return match ($this->error_type) {
            'connection' => 'red',
            'authentication' => 'orange',
            'authorization' => 'yellow',
            'validation' => 'blue',
            'timeout' => 'purple',
            'rate_limit' => 'pink',
            'server_error' => 'red',
            'client_error' => 'orange',
            default => 'gray'
        };
    }

    public function getErrorTypeIcon(): string
    {
        return match ($this->error_type) {
            'connection' => 'wifi-off',
            'authentication' => 'key',
            'authorization' => 'shield',
            'validation' => 'alert-triangle',
            'timeout' => 'clock',
            'rate_limit' => 'gauge',
            'server_error' => 'server',
            'client_error' => 'monitor',
            default => 'alert-circle'
        };
    }

    public function getSeverity(): string
    {
        return match ($this->error_type) {
            'connection', 'server_error' => 'high',
            'authentication', 'authorization' => 'medium',
            'validation', 'timeout', 'rate_limit' => 'low',
            default => 'medium'
        };
    }

    public function getSeverityColor(): string
    {
        return match ($this->getSeverity()) {
            'high' => 'red',
            'medium' => 'orange',
            'low' => 'yellow',
            default => 'gray'
        };
    }

    public function getAgeInMinutes(): int
    {
        return now()->diffInMinutes($this->created_at);
    }

    public function getAgeFormatted(): string
    {
        $minutes = $this->getAgeInMinutes();

        if ($minutes < 1) {
            return 'Just now';
        } elseif ($minutes < 60) {
            return $minutes . ' minutes ago';
        } elseif ($minutes < 1440) {
            return round($minutes / 60) . ' hours ago';
        } else {
            return round($minutes / 1440) . ' days ago';
        }
    }

    public function isRecent(): bool
    {
        return $this->getAgeInMinutes() < 60;
    }

    public function isOld(): bool
    {
        return $this->getAgeInMinutes() > 1440; // 24 hours
    }
}
