<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Domain\Project; // Supondo que a entidade de domínio exista
use App\Domains\Projects\Domain\ProjectRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProjectRepository implements ProjectRepositoryInterface
{
    protected ProjectModel $model;

    public function __construct(ProjectModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo projeto.
     *
     * @param array $data
     *
     * @return Project
     */
    public function create(array $data): Project
    {
        $projectModel = $this->model->create($data);
        return Project::fromArray($projectModel->toArray());
    }

    /**
     * Encontra um projeto pelo seu ID.
     *
     * @param string $id
     *
     * @return Project|null
     */
    public function find(string $id): ?Project
    {
        $projectModel = $this->model->find($id);
        return $projectModel ? Project::fromArray($projectModel->toArray()) : null;
    }

    /**
     * Atualiza um projeto existente.
     *
     * @param string $id
     * @param array  $data
     *
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $projectModel = $this->model->find($id);
        if (!$projectModel) {
            return false;
        }
        return $projectModel->update($data);
    }

    /**
     * Deleta um projeto pelo seu ID.
     *
     * @param string $id
     *
     * @return bool
     */
    public function delete(string $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Encontra projetos por proprietário.
     *
     * @param string $ownerId
     * @return Collection<int, Project>
     */
    public function findByOwnerId(string $ownerId): Collection
    {
        $projects = $this->model->where('owner_id', $ownerId)->get();
        return $projects->map(fn($project) => Project::fromArray($project->toArray()));
    }

    /**
     * Encontra projetos acessíveis por usuário.
     *
     * @param string $userId
     * @return Collection<int, Project>
     */
    public function findAccessibleByUserId(string $userId): Collection
    {
        $projects = $this->model->where(function ($query) use ($userId) {
            $query->where('owner_id', $userId)
                  ->orWhereHas('users', function ($q) use ($userId) {
                      $q->where('user_id', $userId);
                  });
        })->get();

        return $projects->map(fn($project) => Project::fromArray($project->toArray()));
    }

    /**
     * Retorna todos os projetos paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return Project::fromArray($item->toArray());
        });
    }
}
