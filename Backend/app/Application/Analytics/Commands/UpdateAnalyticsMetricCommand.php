<?php

namespace App\Application\Analytics\Commands;

class UpdateAnalyticsMetricCommand
{
    public int $metricId;
    public float $newValue;
    public ?array $metadata;

    public function __construct(int $metricId, float $newValue, ?array $metadata = null)
    {
        $this->metricId = $metricId;
        $this->newValue = $newValue;
        $this->metadata = $metadata;
    }
}