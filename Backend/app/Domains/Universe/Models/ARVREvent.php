<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $session_id
 * @property string|null $object_id
 * @property string $event_type
 * @property string $event_name
 * @property array<string, mixed>|null $event_data
 * @property array<string, mixed>|null $spatial_context
 * @property string|null $user_id
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read ARVRSession $session
 * @property-read ARVRObject|null $object
 * @property-read User|null $user
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class ARVREvent extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'arvr_events';

    protected $fillable = [
        'session_id',
        'object_id',
        'event_type',
        'event_name',
        'event_data',
        'spatial_context',
        'user_id',
        'metadata',
    ];

    protected $casts = [
        'event_data' => 'array',
        'spatial_context' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the session this event belongs to
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(ARVRSession::class, 'session_id');
    }

    /**
     * Get the object this event is related to
     */
    public function object(): BelongsTo
    {
        return $this->belongsTo(ARVRObject::class, 'object_id');
    }

    /**
     * Get the user who triggered this event
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope for events by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    /**
     * Scope for events by session
     */
    public function scopeBySession($query, string $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    /**
     * Scope for events by object
     */
    public function scopeByObject($query, string $objectId)
    {
        return $query->where('object_id', $objectId);
    }

    /**
     * Scope for events by user
     */
    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Get event data as structured array
     */
    public function getEventData(): array
    {
        return $this->event_data ?? [];
    }

    /**
     * Get spatial context as structured array
     */
    public function getSpatialContext(): array
    {
        return $this->spatial_context ?? [];
    }
}
