<?php

namespace App\Domains\Projects\Repositories;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectRepository
{
    /**
     * Busca todos os projetos para um dado usuário.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, ProjectModel>
     */
    public function findAllByUserId(int $userId): Collection
    {
        return ProjectModel::whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();
    }

    /**
     * Busca um projeto pelo seu ID.
     */
    public function findById(string $projectId): ?ProjectModel
    {
        return ProjectModel::find($projectId);
    }

    /**
     * Busca projetos paginados com filtros e ordenação.
     *
     * @param array<string, mixed> $filters
     */
    public function findAllPaginated(array $filters, string $sortBy, string $sortOrder, int $perPage, ?string $userId = null): LengthAwarePaginator
    {
        $query = ProjectModel::query();

        if ($userId) {
            $query->whereHas('users', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['owner_id'])) {
            $query->where('owner_id', $filters['owner_id']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        return $query;
    }

    /**
     * Verifica se o usuário pertence ao projeto.
     */
    public function checkUserMembership(string $userId, string $projectId): bool
    {
        $project = ProjectModel::find($projectId);
        if (!$project) {
            return false;
        }

        return $project->users()->where('user_id', $userId)->exists() || $project->owner_id === $userId;
    }
}
