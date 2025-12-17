<?php

namespace App\Domains\Analytics\Domain;

use DateTime;
use InvalidArgumentException;

class AnalyticsMetric
{
    // Metric type constants
    public const TYPE_PAGE_VIEWS = 'page_views';
    public const TYPE_UNIQUE_VISITORS = 'unique_visitors';
    public const TYPE_SESSIONS = 'sessions';
    public const TYPE_BOUNCE_RATE = 'bounce_rate';
    public const TYPE_CONVERSION_RATE = 'conversion_rate';
    public const TYPE_AVERAGE_SESSION_DURATION = 'average_session_duration';
    public const TYPE_REVENUE = 'revenue';
    public const TYPE_CLICKS = 'clicks';
    public const TYPE_IMPRESSIONS = 'impressions';
    public const TYPE_CTR = 'ctr';
    public const TYPE_CPC = 'cpc';
    public const TYPE_CPM = 'cpm';

    // Source constants
    public const SOURCE_GOOGLE_ANALYTICS = 'google_analytics';
    public const SOURCE_FACEBOOK_ADS = 'facebook_ads';
    public const SOURCE_GOOGLE_ADS = 'google_ads';
    public const SOURCE_WEBSITE = 'website';
    public const SOURCE_APP = 'app';
    public const SOURCE_EMAIL = 'email';
    public const SOURCE_SOCIAL = 'social';

    public ?int $id;
    public string $userId;
    public string $metricType;
    public string $source;
    public float $value;
    public ?string $dimension;
    public ?string $dimensionValue;
    public DateTime $date;
    public ?string $campaignId;
    public ?string $adGroupId;
    public ?string $keyword;
    public ?array $metadata;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $userId,
        string $metricType,
        string $source,
        float $value,
        DateTime $date,
        ?string $dimension = null,
        ?string $dimensionValue = null,
        ?string $campaignId = null,
        ?string $adGroupId = null,
        ?string $keyword = null,
        ?array $metadata = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->validateUserId($userId);
        $this->validateMetricType($metricType);
        $this->validateSource($source);
        $this->validateValue($value);
        $this->validateDate($date);

        $this->id = $id;
        $this->userId = $userId;
        $this->metricType = $metricType;
        $this->source = $source;
        $this->value = $value;
        $this->dimension = $dimension;
        $this->dimensionValue = $dimensionValue;
        $this->date = $date;
        $this->campaignId = $campaignId;
        $this->adGroupId = $adGroupId;
        $this->keyword = $keyword;
        $this->metadata = $metadata;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            metricType: $data['metric_type'],
            source: $data['source'],
            value: (float) $data['value'],
            date: new DateTime($data['date']),
            dimension: $data['dimension'] ?? null,
            dimensionValue: $data['dimension_value'] ?? null,
            campaignId: $data['campaign_id'] ?? null,
            adGroupId: $data['ad_group_id'] ?? null,
            keyword: $data['keyword'] ?? null,
            metadata: $data['metadata'] ?? null,
            id: isset($data['id']) ? (int) $data['id'] : null,
            createdAt: isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'metric_type' => $this->metricType,
            'source' => $this->source,
            'value' => $this->value,
            'dimension' => $this->dimension,
            'dimension_value' => $this->dimensionValue,
            'date' => $this->date->format('Y-m-d'),
            'campaign_id' => $this->campaignId,
            'ad_group_id' => $this->adGroupId,
            'keyword' => $this->keyword,
            'metadata' => $this->metadata,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // ===== VALIDATION METHODS =====

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validateMetricType(string $metricType): void
    {
        $validTypes = [
            self::TYPE_PAGE_VIEWS,
            self::TYPE_UNIQUE_VISITORS,
            self::TYPE_SESSIONS,
            self::TYPE_BOUNCE_RATE,
            self::TYPE_CONVERSION_RATE,
            self::TYPE_AVERAGE_SESSION_DURATION,
            self::TYPE_REVENUE,
            self::TYPE_CLICKS,
            self::TYPE_IMPRESSIONS,
            self::TYPE_CTR,
            self::TYPE_CPC,
            self::TYPE_CPM,
        ];

        if (!in_array($metricType, $validTypes)) {
            throw new InvalidArgumentException("Invalid metric type: {$metricType}");
        }
    }

    private function validateSource(string $source): void
    {
        $validSources = [
            self::SOURCE_GOOGLE_ANALYTICS,
            self::SOURCE_FACEBOOK_ADS,
            self::SOURCE_GOOGLE_ADS,
            self::SOURCE_WEBSITE,
            self::SOURCE_APP,
            self::SOURCE_EMAIL,
            self::SOURCE_SOCIAL,
        ];

        if (!in_array($source, $validSources)) {
            throw new InvalidArgumentException("Invalid source: {$source}");
        }
    }

    private function validateValue(float $value): void
    {
        if ($value < 0) {
            throw new InvalidArgumentException('Metric value cannot be negative');
        }
    }

    private function validateDate(DateTime $date): void
    {
        if ($date > new DateTime()) {
            throw new InvalidArgumentException('Metric date cannot be in the future');
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function updateValue(float $newValue): void
    {
        $this->validateValue($newValue);
        $this->value = $newValue;
        $this->updatedAt = new DateTime();
    }

    public function updateMetadata(array $metadata): void
    {
        $this->metadata = $metadata;
        $this->updatedAt = new DateTime();
    }

    public function addToValue(float $increment): void
    {
        $newValue = $this->value + $increment;
        $this->updateValue($newValue);
    }

    // ===== QUERY METHODS =====

    public function isRevenueMetric(): bool
    {
        return $this->metricType === self::TYPE_REVENUE;
    }

    public function isConversionMetric(): bool
    {
        return in_array($this->metricType, [
            self::TYPE_CONVERSION_RATE,
            self::TYPE_CTR,
        ]);
    }

    public function isTrafficMetric(): bool
    {
        return in_array($this->metricType, [
            self::TYPE_PAGE_VIEWS,
            self::TYPE_UNIQUE_VISITORS,
            self::TYPE_SESSIONS,
        ]);
    }

    public function isEngagementMetric(): bool
    {
        return in_array($this->metricType, [
            self::TYPE_BOUNCE_RATE,
            self::TYPE_AVERAGE_SESSION_DURATION,
        ]);
    }

    public function isAdMetric(): bool
    {
        return in_array($this->metricType, [
            self::TYPE_CLICKS,
            self::TYPE_IMPRESSIONS,
            self::TYPE_CPC,
            self::TYPE_CPM,
        ]);
    }

    public function hasDimension(): bool
    {
        return !empty($this->dimension) && !empty($this->dimensionValue);
    }

    public function isFromAds(): bool
    {
        return in_array($this->source, [
            self::SOURCE_FACEBOOK_ADS,
            self::SOURCE_GOOGLE_ADS,
        ]);
    }

    public function isFromAnalytics(): bool
    {
        return $this->source === self::SOURCE_GOOGLE_ANALYTICS;
    }

    public function getFormattedValue(): string
    {
        switch ($this->metricType) {
            case self::TYPE_REVENUE:
            case self::TYPE_CPC:
            case self::TYPE_CPM:
                return '$' . number_format($this->value, 2);

            case self::TYPE_BOUNCE_RATE:
            case self::TYPE_CONVERSION_RATE:
            case self::TYPE_CTR:
                return number_format($this->value, 2) . '%';

            case self::TYPE_AVERAGE_SESSION_DURATION:
                return $this->formatDuration($this->value);

            default:
                return number_format($this->value);
        }
    }

    private function formatDuration(float $seconds): string
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm %ds', $hours, $minutes, $seconds);
        } elseif ($minutes > 0) {
            return sprintf('%dm %ds', $minutes, $seconds);
        } else {
            return sprintf('%ds', $seconds);
        }
    }

    // ===== STATIC METHODS =====

    public static function getValidMetricTypes(): array
    {
        return [
            self::TYPE_PAGE_VIEWS,
            self::TYPE_UNIQUE_VISITORS,
            self::TYPE_SESSIONS,
            self::TYPE_BOUNCE_RATE,
            self::TYPE_CONVERSION_RATE,
            self::TYPE_AVERAGE_SESSION_DURATION,
            self::TYPE_REVENUE,
            self::TYPE_CLICKS,
            self::TYPE_IMPRESSIONS,
            self::TYPE_CTR,
            self::TYPE_CPC,
            self::TYPE_CPM,
        ];
    }

    public static function getValidSources(): array
    {
        return [
            self::SOURCE_GOOGLE_ANALYTICS,
            self::SOURCE_FACEBOOK_ADS,
            self::SOURCE_GOOGLE_ADS,
            self::SOURCE_WEBSITE,
            self::SOURCE_APP,
            self::SOURCE_EMAIL,
            self::SOURCE_SOCIAL,
        ];
    }

    public static function getRevenueMetrics(): array
    {
        return [
            self::TYPE_REVENUE,
            self::TYPE_CPC,
            self::TYPE_CPM,
        ];
    }

    public static function getTrafficMetrics(): array
    {
        return [
            self::TYPE_PAGE_VIEWS,
            self::TYPE_UNIQUE_VISITORS,
            self::TYPE_SESSIONS,
        ];
    }

    public static function getEngagementMetrics(): array
    {
        return [
            self::TYPE_BOUNCE_RATE,
            self::TYPE_AVERAGE_SESSION_DURATION,
        ];
    }
}
