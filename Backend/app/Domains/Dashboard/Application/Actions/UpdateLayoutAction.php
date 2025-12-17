<?php

namespace App\Domains\Dashboard\Application\Actions;

use App\Domains\Dashboard\Application\DTOs\LayoutDTO;
use App\Domains\Dashboard\Application\Services\LayoutService;
use App\Domains\Dashboard\Application\Services\RealTimeService;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardLayoutModel as DashboardLayout;

class UpdateLayoutAction
{
    public function __construct(
        private readonly LayoutService $layoutService,
        private readonly RealTimeService $realTimeService
    ) {
    }

    public function execute(LayoutDTO $dto): DashboardLayout
    {
        $layout = $this->layoutService->saveOrUpdateLayout($dto);
        
        $this->realTimeService->broadcastLayoutUpdate(
            $dto->userId,
            $dto->layout
        );

        return $layout;
    }
}
