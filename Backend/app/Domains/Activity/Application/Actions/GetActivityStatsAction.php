<?php

namespace App\Domains\Activity\Application\Actions;

use App\Domains\Activity\Application\DTOs\ActivityFilterDTO;
use App\Domains\Activity\Application\DTOs\ActivityStatsDTO;
use App\Domains\Activity\Application\Services\ActivityStatsService;
use Illuminate\Support\Facades\Cache;

class GetActivityStatsAction
{
    public function __construct(
        private ActivityStatsService $statsService
    ) {}

    public function execute(ActivityFilterDTO $filters): ActivityStatsDTO
    {
        $cacheKey = 'activity_stats_' . md5(serialize($filters));

        return Cache::remember($cacheKey, 300, function() use ($filters) {
            return $this->statsService->calculateStats($filters);
        });
    }
}
