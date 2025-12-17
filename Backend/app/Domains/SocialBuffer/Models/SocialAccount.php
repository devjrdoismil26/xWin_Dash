<?php

namespace App\Domains\SocialBuffer\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * SocialAccount Model
 * 
 * SECURITY FIX (SEC-006): Tokens agora são criptografados usando Laravel encrypted casting
 * SECURITY FIX (MODEL-002): Adicionado BelongsToProject trait para multi-tenancy
 */
class SocialAccount extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'social_accounts';

    protected $fillable = [
        'user_id',
        'project_id',
        'platform',
        'account_name',
        'account_id',
        'username',
        'profile_image',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'metadata',
        'is_active',
    ];

    /**
     * SECURITY: access_token e refresh_token são criptografados automaticamente
     * usando o encrypted cast do Laravel
     */
    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
        'token_expires_at' => 'datetime',
        'access_token' => 'encrypted',   // SECURITY FIX: Criptografia automática
        'refresh_token' => 'encrypted',  // SECURITY FIX: Criptografia automática
    ];

    /**
     * SECURITY: Tokens são hidden por padrão nas serializations
     */
    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(SocialPost::class, 'post_social_accounts')
            ->withPivot(['status', 'external_id', 'external_url', 'published_at'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    /**
     * Check if the access token is expired.
     *
     * @return bool
     */
    public function isTokenExpired(): bool
    {
        if (!$this->token_expires_at) {
            return false;
        }

        return $this->token_expires_at->isPast();
    }

    /**
     * Check if the token needs refresh (expires within the buffer time).
     *
     * @param int $bufferMinutes Minutes before expiration to consider as needing refresh
     * @return bool
     */
    public function needsTokenRefresh(int $bufferMinutes = 5): bool
    {
        if (!$this->token_expires_at) {
            return false;
        }

        return $this->token_expires_at->subMinutes($bufferMinutes)->isPast();
    }

    /**
     * Get the decrypted access token for API calls.
     * Note: Due to encrypted casting, accessing $this->access_token already decrypts it.
     *
     * @return string|null
     */
    public function getDecryptedAccessToken(): ?string
    {
        return $this->access_token;
    }

    /**
     * Get the decrypted refresh token for API calls.
     * Note: Due to encrypted casting, accessing $this->refresh_token already decrypts it.
     *
     * @return string|null
     */
    public function getDecryptedRefreshToken(): ?string
    {
        return $this->refresh_token;
    }
}
