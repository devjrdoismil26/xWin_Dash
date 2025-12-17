<?php

namespace App\Domains\Dashboard\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * DashboardShare Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class DashboardShare extends Model
{
    use BelongsToProject;

    protected $table = 'dashboard_shares';

    protected $fillable = [
        'dashboard_id',
        'user_id',
        'token',
        'share_url',
        'permissions',
        'expires_at',
        'view_count',
        'last_accessed_at',
        'is_active',
        'project_id',
    ];

    protected $casts = [
        'permissions' => 'array',
        'expires_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'is_active' => 'boolean',
        'view_count' => 'integer',
    ];

    /**
     * Generate a unique share token
     */
    public static function generateToken(): string
    {
        do {
            $token = Str::random(64);
        } while (self::where('token', $token)->exists());

        return $token;
    }

    /**
     * Check if share is valid (not expired and active)
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Increment view count and update last accessed
     */
    public function recordAccess(): void
    {
        $this->increment('view_count');
        $this->update(['last_accessed_at' => now()]);
    }

    /**
     * Get the user that created the share
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Get the dashboard being shared
     */
    public function dashboard(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Dashboard\Models\Dashboard::class);
    }
}
