<?php

namespace App\Domains\Analytics\Application\Actions;

use App\Domains\Analytics\Application\DTOs\ReportDTO;
use App\Domains\Analytics\Application\Services\ReportBuilderService;

class GenerateReportAction
{
    public function __construct(
        private readonly ReportBuilderService $reportBuilderService
    ) {
    }

    public function execute(ReportDTO $dto): array
    {
        return $this->reportBuilderService->buildReport($dto);
    }

    public function executeCustom(array $config): array
    {
        return $this->reportBuilderService->generateCustomReport($config);
    }
}
