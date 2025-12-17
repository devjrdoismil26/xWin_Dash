<?php

namespace App\Domains\ADStool\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * AdCreative Model
 * 
 * SECURITY FIX (SCOPE-007): Adicionado BelongsToProject para multi-tenancy
 */
class AdCreative extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'ads_creatives';

    protected $fillable = [
        'campaign_id',
        'user_id',
        'project_id',
        'name',
        'type',
        'platform_creative_id',
        'headline',
        'description',
        'body',
        'call_to_action',
        'destination_url',
        'media_urls',
        'settings',
        'status',
    ];

    protected $casts = [
        'media_urls' => 'array',
        'settings' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(AdCampaign::class, 'campaign_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
