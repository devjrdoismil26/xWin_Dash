<?php

namespace App\Domains\ADStool\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AdAudience extends Model
{
    use HasUuids;

    protected $table = 'ad_audiences';

    protected $fillable = [
        'account_id',
        'user_id',
        'name',
        'platform_audience_id',
        'type',
        'criteria',
        'size',
    ];

    protected $casts = [
        'criteria' => 'array',
        'size' => 'integer',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(AdAccount::class, 'account_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(AdCampaign::class, 'campaign_audiences');
    }
}
