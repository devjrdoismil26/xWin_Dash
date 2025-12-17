<?php

namespace App\Domains\Dashboard\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Dashboard Alert Model
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 *
 * @property string $id
 * @property string $user_id
 * @property string|null $project_id
 * @property string $type
 * @property string $title
 * @property string $message
 * @property array|null $metadata
 * @property bool $read
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class DashboardAlertModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'dashboard_alerts';

    protected $fillable = [
        'user_id',
        'project_id',
        'type',
        'title',
        'message',
        'metadata',
        'read',
        'read_at',
        'expires_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'read' => 'boolean',
        'read_at' => 'datetime',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Check if alert is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Mark alert as read
     */
    public function markAsRead(): bool
    {
        return $this->update([
            'read' => true,
            'read_at' => now(),
        ]);
    }
}
