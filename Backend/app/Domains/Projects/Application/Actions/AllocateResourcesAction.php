<?php

namespace App\Domains\Projects\Application\Actions;

use App\Domains\Projects\Application\Services\ResourceAllocationService;

class AllocateResourcesAction
{
    public function __construct(
        private readonly ResourceAllocationService $resourceAllocationService
    ) {
    }

    public function execute(array $data): array
    {
        $allocation = $this->resourceAllocationService->allocateResource($data);
        return $allocation->toArray();
    }
}
