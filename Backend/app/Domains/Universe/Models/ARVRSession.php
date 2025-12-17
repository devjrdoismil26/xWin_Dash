<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $user_id
 * @property string $session_name
 * @property string $session_type
 * @property string $status
 * @property array<string, mixed>|null $configuration
 * @property array<string, mixed>|null $spatial_data
 * @property array<string, mixed>|null $device_info
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $ended_at
 * @property int $duration_seconds
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ARVRObject> $objects
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ARVREvent> $events
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class ARVRSession extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'arvr_sessions';

    protected $fillable = [
        'user_id',
        'session_name',
        'session_type',
        'status',
        'configuration',
        'spatial_data',
        'device_info',
        'metadata',
        'started_at',
        'ended_at',
        'duration_seconds',
    ];

    protected $casts = [
        'configuration' => 'array',
        'spatial_data' => 'array',
        'device_info' => 'array',
        'metadata' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user who created this session
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all objects in this session
     */
    public function objects(): HasMany
    {
        return $this->hasMany(ARVRObject::class, 'session_id');
    }

    /**
     * Get all events in this session
     */
    public function events(): HasMany
    {
        return $this->hasMany(ARVREvent::class, 'session_id');
    }

    /**
     * Scope for active sessions
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for sessions by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('session_type', $type);
    }

    /**
     * Scope for sessions by user
     */
    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Calculate session duration
     */
    public function calculateDuration(): int
    {
        if ($this->started_at && $this->ended_at) {
            return $this->ended_at->diffInSeconds($this->started_at);
        }
        return 0;
    }

    /**
     * Check if session is currently active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->started_at && !$this->ended_at;
    }
}
