<?php

namespace App\Domains\Activity\Application\Actions;

use App\Domains\Activity\Application\DTOs\ActivityExportDTO;
use App\Domains\Activity\Application\Services\ActivityExportService;

class ExportActivitiesAction
{
    public function __construct(
        private ActivityExportService $exportService
    ) {}

    public function execute(ActivityExportDTO $dto): string
    {
        return $this->exportService->export($dto);
    }
}
