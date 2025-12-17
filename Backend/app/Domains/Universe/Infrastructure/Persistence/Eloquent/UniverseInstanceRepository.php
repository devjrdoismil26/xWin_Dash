<?php

namespace App\Domains\Universe\Infrastructure\Persistence\Eloquent;

use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UniverseInstanceRepository implements UniverseInstanceRepositoryInterface
{
    protected UniverseInstanceModel $model;

    public function __construct(UniverseInstanceModel $model)
    {
        $this->model = $model;
    }

    public function find(string $id): ?UniverseInstanceModel
    {
        return $this->model->find($id);
    }
    
    public function findAll(): Collection
    {
        return $this->model->all();
    }
    
    public function findByProject(string $projectId): Collection
    {
        return $this->model->byProject($projectId)->get();
    }

    public function findByUser(string $userId): Collection
    {
        return $this->model->byUser($userId)->get();
    }
    
    public function save(UniverseInstanceModel $instance): UniverseInstanceModel
    {
        $instance->save();
        return $instance;
    }
    
    public function delete(string $id): bool
    {
        return $this->model->destroy($id) > 0;
    }
    
    public function findByStatus(string $status): Collection
    {
        return $this->model->byStatus($status)->get();
    }
    
    public function findByTemplate(string $templateId): Collection
    {
        return $this->model->byTemplate($templateId)->get();
    }

    // Métodos adicionais para melhor performance
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        if (isset($filters['status'])) {
            $query->byStatus($filters['status']);
        }

        if (isset($filters['project_id'])) {
            $query->byProject($filters['project_id']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        
        return $query->orderBy($sortBy, $sortDirection)->paginate($perPage);
    }

    public function create(array $data): UniverseInstanceModel
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data) > 0;
    }

    public function getActiveByProject(string $projectId): Collection
    {
        return $this->model->active()->byProject($projectId)->get();
    }

    public function getActiveByUser(string $userId): Collection
    {
        return $this->model->active()->byUser($userId)->get();
    }

    public function getDefaultByUser(string $userId): ?UniverseInstanceModel
    {
        return $this->model->default()->byUser($userId)->first();
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->active()->count(),
            'by_status' => $this->model->selectRaw('status, count(*) as count')
                                      ->groupBy('status')
                                      ->pluck('count', 'status')
                                      ->toArray()
        ];
    }
}