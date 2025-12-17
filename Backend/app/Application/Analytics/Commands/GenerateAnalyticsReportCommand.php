<?php

namespace App\Application\Analytics\Commands;

class GenerateAnalyticsReportCommand
{
    public string $userId;
    public string $reportType;
    public string $startDate;
    public string $endDate;
    public array $filters;

    public function __construct(
        string $userId,
        string $reportType,
        string $startDate,
        string $endDate,
        array $filters = []
    ) {
        $this->userId = $userId;
        $this->reportType = $reportType;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->filters = $filters;
    }
}