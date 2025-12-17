<?php

namespace App\Domains\Analytics\Application\Actions;

use App\Domains\Analytics\Application\DTOs\KPIConfigDTO;
use App\Domains\Analytics\Application\Services\KPICalculatorService;

class CalculateKPIsAction
{
    public function __construct(
        private readonly KPICalculatorService $kpiCalculatorService
    ) {
    }

    public function execute(KPIConfigDTO $dto): array
    {
        return $this->kpiCalculatorService->calculateKPI($dto);
    }

    public function executeAll(?string $userId = null): array
    {
        return $this->kpiCalculatorService->calculateAllKPIs($userId)->toArray();
    }
}
