<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * SocialAccountModel - Infrastructure Layer Model
 * 
 * SECURITY FIX (SEC-006): Tokens agora são criptografados usando Laravel encrypted casting
 * SECURITY FIX (SCOPE-003): Adicionado BelongsToProject para multi-tenancy
 */
class SocialAccountModel extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'social_accounts';

    protected $fillable = [
        'user_id',
        'project_id',
        'platform',
        'platform_user_id',
        'account_name',
        'account_id',
        'username',
        'profile_image',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'expires_at',
        'metadata',
        'is_active',
    ];

    /**
     * SECURITY: access_token e refresh_token são criptografados automaticamente
     * usando o encrypted cast do Laravel
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'token_expires_at' => 'datetime',
        'metadata' => 'array',
        'is_active' => 'boolean',
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

    /**
     * Relacionamento com o usuário
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Check if the access token is expired.
     *
     * @return bool
     */
    public function isTokenExpired(): bool
    {
        $expiresAt = $this->token_expires_at ?? $this->expires_at;
        
        if (!$expiresAt) {
            return false;
        }

        return $expiresAt->isPast();
    }
}
