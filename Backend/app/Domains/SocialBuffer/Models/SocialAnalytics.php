<?php

namespace App\Domains\SocialBuffer\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * SocialAnalytics Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class SocialAnalytics extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'social_analytics';

    protected $fillable = [
        'post_id',
        'social_account_id',
        'likes',
        'comments',
        'shares',
        'views',
        'clicks',
        'saves',
        'engagement_rate',
        'metadata',
        'synced_at',
        'project_id',
    ];

    protected $casts = [
        'metadata' => 'array',
        'likes' => 'integer',
        'comments' => 'integer',
        'shares' => 'integer',
        'views' => 'integer',
        'clicks' => 'integer',
        'saves' => 'integer',
        'engagement_rate' => 'decimal:2',
        'synced_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(SocialPost::class, 'post_id');
    }

    public function socialAccount(): BelongsTo
    {
        return $this->belongsTo(SocialAccount::class);
    }
}
