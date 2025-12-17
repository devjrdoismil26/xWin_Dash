<?php

namespace App\Domains\Dashboard\Application\Actions;

use App\Domains\Dashboard\Application\DTOs\CustomizationDTO;
use App\Domains\Dashboard\Application\Services\CustomizationService;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\UserDashboardConfigModel as UserDashboardConfig;

class SaveCustomizationAction
{
    public function __construct(
        private readonly CustomizationService $customizationService
    ) {
    }

    public function execute(CustomizationDTO $dto): UserDashboardConfig
    {
        return $this->customizationService->saveOrUpdateConfig($dto);
    }
}
