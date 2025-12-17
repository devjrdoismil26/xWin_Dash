<?php

namespace App\Domains\Universe\Repositories;

use App\Domains\Universe\Models\UniverseInstance;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UniverseInstanceRepository
{
    public function findByUser(int $userId, array $filters = []): LengthAwarePaginator
    {
        return UniverseInstance::byUser($userId)
            ->when($filters['active'] ?? false, fn($q) => $q->active())
            ->when($filters['search'] ?? null, fn($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->with(['blocks', 'template', 'project'])
            ->orderBy('last_accessed_at', 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function findWithBlocks(string $id): UniverseInstance
    {
        return UniverseInstance::with(['blocks.connections', 'snapshots'])
            ->findOrFail($id);
    }

    public function findActive(): Collection
    {
        return UniverseInstance::active()
            ->with('user')
            ->orderBy('last_accessed_at', 'desc')
            ->get();
    }

    public function search(string $term, array $filters = []): LengthAwarePaginator
    {
        return UniverseInstance::where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%")
            ->when($filters['user_id'] ?? null, fn($q, $userId) => $q->byUser($userId))
            ->paginate($filters['per_page'] ?? 15);
    }

    public function findByProject(string $projectId): Collection
    {
        return UniverseInstance::where('project_id', $projectId)
            ->with('blocks')
            ->get();
    }
}
