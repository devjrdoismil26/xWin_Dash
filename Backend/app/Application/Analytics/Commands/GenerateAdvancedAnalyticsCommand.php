<?php

namespace App\Application\Analytics\Commands;

class GenerateAdvancedAnalyticsCommand
{
    public string $reportType;
    public string $startDate;
    public string $endDate;
    public int $userId;
    public ?array $modules;
    public ?array $filters;
    public ?string $timezone;
    public ?string $currency;

    public function __construct(
        string $reportType,
        string $startDate,
        string $endDate,
        int $userId,
        ?array $modules = null,
        ?array $filters = null,
        ?string $timezone = null,
        ?string $currency = null
    ) {
        $this->reportType = $reportType;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->modules = $modules;
        $this->filters = $filters;
        $this->timezone = $timezone;
        $this->currency = $currency;
    }
}