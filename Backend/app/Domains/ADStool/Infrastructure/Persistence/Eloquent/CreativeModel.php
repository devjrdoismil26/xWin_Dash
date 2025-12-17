<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read ADSCampaign|null $campaign
 */
class CreativeModel extends Model
{
    use HasFactory;

    protected $table = 'adstool_creatives';

    protected $fillable = [
        'campaign_id',
        'name',
        'type',
        'content',
        'assets',
        'performance_metrics',
        'status',
        'platform_creative_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'content' => 'array',
        'assets' => 'array',
        'performance_metrics' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(ADSCampaign::class, 'campaign_id');
    }

    public function getCTR(): float
    {
        $clicks = (float) ($this->performance_metrics['clicks'] ?? 0);
        $impressions = (float) ($this->performance_metrics['impressions'] ?? 0);
        return $impressions > 0 ? ($clicks / $impressions) * 100.0 : 0.0;
    }

    public function getCPC(): float
    {
        $cost = (float) ($this->performance_metrics['cost'] ?? 0);
        $clicks = (float) ($this->performance_metrics['clicks'] ?? 0);
        return $clicks > 0 ? $cost / $clicks : 0.0;
    }

    public function getConversionRate(): float
    {
        $conversions = (float) ($this->performance_metrics['conversions'] ?? 0);
        $clicks = (float) ($this->performance_metrics['clicks'] ?? 0);
        return $clicks > 0 ? ($conversions / $clicks) * 100.0 : 0.0;
    }

    public function isPerformingWell(): bool
    {
        $campaign = $this->campaign;
        $platform = $campaign?->platform;
        $threshold = match ($platform) {
            'google' => 1.0, // percent
            'facebook' => 0.5,
            default => 0.1,
        };
        return $this->getCTR() >= $threshold;
    }

    /**
     * @return array<int, mixed>
     */
    public function getAssetsByType(string $type): array
    {
        return array_values(array_filter($this->assets ?? [], fn ($asset) => ($asset['type'] ?? null) === $type));
    }
}
