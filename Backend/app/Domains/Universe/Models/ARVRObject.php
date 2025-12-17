<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $session_id
 * @property string $object_name
 * @property string $object_type
 * @property array<string, mixed> $position
 * @property array<string, mixed> $rotation
 * @property array<string, mixed> $scale
 * @property array<string, mixed>|null $properties
 * @property array<string, mixed>|null $interactions
 * @property string $status
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @property-read ARVRSession $session
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ARVREvent> $events
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class ARVRObject extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'arvr_objects';

    protected $fillable = [
        'session_id',
        'object_name',
        'object_type',
        'position',
        'rotation',
        'scale',
        'properties',
        'interactions',
        'status',
        'metadata',
    ];

    protected $casts = [
        'position' => 'array',
        'rotation' => 'array',
        'scale' => 'array',
        'properties' => 'array',
        'interactions' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the session this object belongs to
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(ARVRSession::class, 'session_id');
    }

    /**
     * Get all events related to this object
     */
    public function events(): HasMany
    {
        return $this->hasMany(ARVREvent::class, 'object_id');
    }

    /**
     * Scope for active objects
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for objects by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('object_type', $type);
    }

    /**
     * Scope for objects by session
     */
    public function scopeBySession($query, string $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    /**
     * Get object position as vector
     */
    public function getPositionVector(): array
    {
        return [
            'x' => $this->position['x'] ?? 0,
            'y' => $this->position['y'] ?? 0,
            'z' => $this->position['z'] ?? 0,
        ];
    }

    /**
     * Get object rotation as quaternion
     */
    public function getRotationQuaternion(): array
    {
        return [
            'x' => $this->rotation['x'] ?? 0,
            'y' => $this->rotation['y'] ?? 0,
            'z' => $this->rotation['z'] ?? 0,
            'w' => $this->rotation['w'] ?? 1,
        ];
    }

    /**
     * Get object scale as vector
     */
    public function getScaleVector(): array
    {
        return [
            'x' => $this->scale['x'] ?? 1,
            'y' => $this->scale['y'] ?? 1,
            'z' => $this->scale['z'] ?? 1,
        ];
    }
}
