<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use App\Domains\ADStool\Contracts\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\DTOs\UpdateADSCampaignDTO;
use App\Domains\ADStool\Enums\CampaignStatus;
use App\Domains\ADStool\Models\ADSCampaign;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaign as EloquentADSCampaign;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Implementação do repositório de campanhas usando Eloquent.
 */
class ADSCampaignRepository implements ADSCampaignRepositoryInterface
{
    protected EloquentADSCampaign $model;

    public function __construct(EloquentADSCampaign $model)
    {
        $this->model = $model;
    }

    public function find(string $id): ?ADSCampaign
    {
        /** @var ADSCampaign|null */
        return $this->model->newQuery()->find($id);
    }

    /**
     * @param array<string> $columns
     * @return Collection<int, ADSCampaign>
     */
    public function all(array $columns = ['*']): Collection
    {
        /** @var Collection<int, ADSCampaign> */
        return $this->model->newQuery()->get($columns);
    }

    /**
     * @param array<string> $columns
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator */
        return $this->model->newQuery()->paginate($perPage, $columns);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): ADSCampaign
    {
        /** @var ADSCampaign */
        return $this->model->newQuery()->create($data);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): ADSCampaign
    {
        /** @var ADSCampaign */
        $model = $this->model->newQuery()->findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function createFromDTO(CreateADSCampaignDTO $data): ADSCampaign
    {
        return $this->create($data->toArray());
    }

    public function updateFromDTO(string $id, UpdateADSCampaignDTO $data): ADSCampaign
    {
        return $this->update($id, $data->toArray());
    }

    public function delete(string $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * @return Collection<int, ADSCampaign>
     */
    public function findByProject(string $projectId): Collection
    {
        /** @var Collection<int, ADSCampaign> */
        return $this->model->newQuery()->where('project_id', $projectId)->get();
    }

    /**
     * @return Collection<int, ADSCampaign>
     */
    public function findByStatus(CampaignStatus $status): Collection
    {
        /** @var Collection<int, ADSCampaign> */
        return $this->model->newQuery()->where('status', $status->value)->get();
    }



    /**
     * Retorna todas as campanhas de um usuário.
     *
     * @param int $userId
     *
     * @return Collection<int, ADSCampaign>
     */
    public function findByUser(int $userId): Collection
    {
        /** @var Collection<int, ADSCampaign> */
        return $this->model->newQuery()->where('user_id', $userId)->get();
    }
}
