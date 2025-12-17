<?php

namespace App\Domains\Projects\Application\Services;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ResourceAllocationModel as ResourceAllocation;
use Illuminate\Support\Collection;

class ResourceAllocationService
{
    public function getAllocationsByProject(string $projectId): Collection
    {
        return ResourceAllocation::where('project_id', $projectId)
            ->with(['user', 'task'])
            ->get();
    }

    public function allocateResource(array $data): ResourceAllocation
    {
        return ResourceAllocation::create($data);
    }

    public function updateAllocation(string $id, array $data): bool
    {
        $allocation = ResourceAllocation::findOrFail($id);
        return $allocation->update($data);
    }

    public function getResourceAvailability(string $userId, string $startDate, string $endDate): array
    {
        $allocations = ResourceAllocation::where('user_id', $userId)
            ->whereBetween('start_date', [$startDate, $endDate])
            ->orWhereBetween('end_date', [$startDate, $endDate])
            ->get();

        $totalAllocated = $allocations->sum('allocated_hours');

        return [
            'user_id' => $userId,
            'period' => ['start' => $startDate, 'end' => $endDate],
            'total_allocated' => $totalAllocated,
            'allocations' => $allocations,
        ];
    }
}
