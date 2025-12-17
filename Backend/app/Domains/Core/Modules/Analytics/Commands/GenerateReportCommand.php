<?php

namespace App\Domains\Core\Modules\Analytics\Commands;

class GenerateReportCommand
{
    public string $reportType;

    public string $startDate;

    public string $endDate;

    public ?array $filters;

    public function __construct(string $reportType, string $startDate, string $endDate, ?array $filters = null)
    {
        $this->reportType = $reportType;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->filters = $filters;
    }
}
