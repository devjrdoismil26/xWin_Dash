<?php

namespace App\Domains\ADStool\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AdCampaign Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class AdCampaign extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'ad_campaigns';

    protected $fillable = [
        'account_id',
        'user_id',
        'project_id',
        'name',
        'platform_campaign_id',
        'status',
        'objective',
        'budget',
        'budget_type',
        'start_date',
        'end_date',
        'targeting',
        'settings',
        'metrics',
    ];

    protected $casts = [
        'targeting' => 'array',
        'settings' => 'array',
        'metrics' => 'array',
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(AdAccount::class, 'account_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function creatives(): HasMany
    {
        return $this->hasMany(AdCreative::class, 'campaign_id');
    }

    public function analytics(): HasMany
    {
        return $this->hasMany(AdAnalytics::class, 'campaign_id');
    }

    public function keywords(): HasMany
    {
        return $this->hasMany(AdKeyword::class, 'campaign_id');
    }

    public function audiences(): BelongsToMany
    {
        return $this->belongsToMany(AdAudience::class, 'campaign_audiences');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
