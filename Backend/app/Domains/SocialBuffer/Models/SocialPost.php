<?php

namespace App\Domains\SocialBuffer\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * SocialPost Model
 * 
 * SECURITY FIX (MODEL-002): Adicionado BelongsToProject trait para multi-tenancy
 */
class SocialPost extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'social_posts';

    protected $fillable = [
        'user_id',
        'project_id',
        'content',
        'title',
        'description',
        'status',
        'type',
        'priority',
        'scheduled_at',
        'published_at',
        'failed_at',
        'link_url',
        'link_title',
        'link_description',
        'link_image',
        'hashtags',
        'mentions',
        'location',
        'metadata',
        'custom_fields',
        'retry_count',
        'error_message',
    ];

    protected $casts = [
        'hashtags' => 'array',
        'mentions' => 'array',
        'location' => 'array',
        'metadata' => 'array',
        'custom_fields' => 'array',
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'failed_at' => 'datetime',
        'retry_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function socialAccounts(): BelongsToMany
    {
        return $this->belongsToMany(SocialAccount::class, 'post_social_accounts')
            ->withPivot(['status', 'external_id', 'external_url', 'error_message', 'published_at'])
            ->withTimestamps();
    }

    public function media(): HasMany
    {
        return $this->hasMany(SocialMedia::class, 'post_id');
    }

    public function analytics(): HasMany
    {
        return $this->hasMany(SocialAnalytics::class, 'post_id');
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(SocialInteraction::class, 'post_id');
    }

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
