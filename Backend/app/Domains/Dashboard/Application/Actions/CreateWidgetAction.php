<?php

namespace App\Domains\Dashboard\Application\Actions;

use App\Domains\Dashboard\Application\DTOs\WidgetDTO;
use App\Domains\Dashboard\Application\Services\WidgetService;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\WidgetModel as Widget;

class CreateWidgetAction
{
    public function __construct(
        private readonly WidgetService $widgetService
    ) {
    }

    public function execute(WidgetDTO $dto): Widget
    {
        return $this->widgetService->createWidget($dto);
    }
}
