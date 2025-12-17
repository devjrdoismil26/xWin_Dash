<?php

namespace App\Domains\Integrations\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Integration Model
 * 
 * SECURITY FIX (MODEL-008): Adicionado BelongsToProject trait para multi-tenancy
 */
class Integration extends Model
{
    use BelongsToProject;
    protected $table = 'integrations';

    protected $fillable = [
        'name',
        'provider',
        'status',
        'config',
        'credentials_id',
        'user_id',
        'project_id',
        'last_sync_at',
        'sync_frequency',
        'is_active',
        'error_count',
        'last_error'
    ];

    protected $casts = [
        'config' => 'array',
        'last_sync_at' => 'datetime',
        'is_active' => 'boolean',
        'error_count' => 'integer'
    ];

    public function credentials(): BelongsTo
    {
        return $this->belongsTo(ApiCredential::class, 'credentials_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(IntegrationLog::class);
    }

    public function mappings(): HasMany
    {
        return $this->hasMany(IntegrationMapping::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByProvider($query, string $provider)
    {
        return $query->where('provider', $provider);
    }

    public function scopeForProject($query, int $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeNeedsSync($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('last_sync_at')
                    ->orWhereRaw('last_sync_at < DATE_SUB(NOW(), INTERVAL sync_frequency MINUTE)');
            });
    }

    public function markSynced(): void
    {
        $this->update([
            'last_sync_at' => now(),
            'error_count' => 0,
            'last_error' => null
        ]);
    }

    public function recordError(string $error): void
    {
        $this->increment('error_count');
        $this->update(['last_error' => $error]);

        if ($this->error_count >= 5) {
            $this->update(['is_active' => false]);
        }
    }

    public function isHealthy(): bool
    {
        return $this->is_active && $this->error_count < 3;
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'connected' => 'green',
            'syncing' => 'blue',
            'error' => 'red',
            'disconnected' => 'gray',
            default => 'yellow'
        };
    }
}
