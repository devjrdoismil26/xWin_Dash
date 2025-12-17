<?php

namespace App\Domains\Core\Application\Actions;

use App\Domains\Core\Application\DTOs\IntegrationConfigDTO;
use App\Domains\Core\Application\Services\IntegrationService;

class ConfigureIntegrationAction
{
    public function __construct(
        private IntegrationService $integrationService
    ) {}

    public function execute(IntegrationConfigDTO $dto): bool
    {
        // Validar credenciais antes de salvar
        $testResult = $this->integrationService->test($dto->service);
        
        if (!$testResult['success']) {
            throw new \Exception('Integration test failed: ' . $testResult['message']);
        }

        return $this->integrationService->configure($dto);
    }
}
