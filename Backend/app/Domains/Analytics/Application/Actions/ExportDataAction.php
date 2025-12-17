<?php

namespace App\Domains\Analytics\Application\Actions;

use App\Domains\Analytics\Application\DTOs\ExportConfigDTO;
use App\Domains\Analytics\Application\Services\ExportService;

class ExportDataAction
{
    public function __construct(
        private readonly ExportService $exportService
    ) {
    }

    public function execute(ExportConfigDTO $dto): string
    {
        return match($dto->format) {
            'csv' => $this->exportService->exportToCSV($dto),
            'pdf' => $this->exportService->exportToPDF($dto),
            'excel', 'xlsx' => $this->exportService->exportToExcel($dto),
            default => throw new \InvalidArgumentException("Unsupported format: {$dto->format}"),
        };
    }
}
