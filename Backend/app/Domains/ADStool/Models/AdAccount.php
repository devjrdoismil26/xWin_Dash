<?php

namespace App\Domains\ADStool\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AdAccount Model
 * 
 * SECURITY FIX (SEC-009): Criptografia de tokens
 * SECURITY FIX (MODEL-010): Adicionado BelongsToProject trait
 */
class AdAccount extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'ad_accounts';

    protected $fillable = [
        'user_id',
        'project_id',
        'platform',
        'account_name',
        'account_id',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'currency',
        'daily_budget',
        'settings',
        'is_active',
        'last_synced_at',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'daily_budget' => 'decimal:2',
        'token_expires_at' => 'datetime',
        'last_synced_at' => 'datetime',
        'access_token' => 'encrypted',   // SECURITY FIX: Criptografia automática
        'refresh_token' => 'encrypted',  // SECURITY FIX: Criptografia automática
    ];

    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(AdCampaign::class, 'account_id');
    }

    public function audiences(): HasMany
    {
        return $this->hasMany(AdAudience::class, 'account_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }
}
