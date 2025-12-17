<?php

namespace App\Domains\Activity\Application\Actions;

use App\Domains\Activity\Application\Services\ActivityLogService;
use App\Domains\Activity\Events\ActivityLogged;

class LogActivityAction
{
    public function __construct(
        private ActivityLogService $activityService
    ) {}

    public function execute(string $action, string $entity_type, string $entity_id, array $metadata = []): void
    {
        $log = $this->activityService->log($action, $entity_type, $entity_id, $metadata);
        
        event(new ActivityLogged($log));
    }
}
