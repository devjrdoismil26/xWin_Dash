<?php

namespace App\Domains\ADStool\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdKeyword extends Model
{
    use HasUuids;

    protected $table = 'ad_keywords';

    protected $fillable = [
        'campaign_id',
        'keyword',
        'match_type',
        'max_cpc',
        'status',
        'quality_score',
        'metrics',
    ];

    protected $casts = [
        'max_cpc' => 'decimal:2',
        'quality_score' => 'integer',
        'metrics' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(AdCampaign::class, 'campaign_id');
    }
}
