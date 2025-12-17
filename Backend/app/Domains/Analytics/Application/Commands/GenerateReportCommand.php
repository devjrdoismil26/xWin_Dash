<?php

namespace App\Domains\Analytics\Application\Commands;

class GenerateReportCommand
{
    public function __construct(
        public readonly string $reportType,
        public readonly ?array $metrics = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?array $filters = null,
        public readonly ?string $format = 'json',
        public readonly ?array $parameters = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'report_type' => $this->reportType,
            'metrics' => $this->metrics,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'filters' => $this->filters,
            'format' => $this->format,
            'parameters' => $this->parameters
        ];
    }
}
