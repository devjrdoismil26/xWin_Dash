<?php

namespace App\Domains\Core\Application\Actions;

use App\Domains\Core\Application\Services\CacheManagementService;

class ManageCacheAction
{
    public function __construct(
        private CacheManagementService $cacheService
    ) {}

    public function execute(string $operation, array $params = []): mixed
    {
        return match($operation) {
            'clear' => $this->cacheService->clear($params['pattern'] ?? '*'),
            'warmup' => $this->cacheService->warmup($params['keys'] ?? []),
            'stats' => $this->cacheService->getStats(),
            default => throw new \InvalidArgumentException('Invalid operation')
        };
    }
}
