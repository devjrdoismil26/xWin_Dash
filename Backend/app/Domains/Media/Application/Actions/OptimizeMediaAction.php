<?php

namespace App\Domains\Media\Application\Actions;

use App\Domains\Media\Application\DTOs\MediaOptimizationDTO;
use App\Domains\Media\Application\Services\MediaOptimizationService;

class OptimizeMediaAction
{
    public function __construct(
        private MediaOptimizationService $optimizationService
    ) {}

    public function execute(MediaOptimizationDTO $dto): bool
    {
        return $this->optimizationService->optimize($dto);
    }
}
