<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use App\Domains\ADStool\Domain\CreativeRepositoryInterface;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\CreativeModel;
use App\Domains\ADStool\Models\Creative;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementação do repositório de criativos usando Eloquent.
 */
class CreativeRepository implements CreativeRepositoryInterface
{
    /**
     * @var CreativeModel
     */
    protected CreativeModel $model;

    /**
     * @param CreativeModel $model
     */
    public function __construct(CreativeModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo criativo.
     *
     * @param array<string, mixed> $data
     *
     * @return Creative
     */
    public function create(array $data): Creative
    {
        return Creative::create($data);
    }

    /**
     * Atualiza um criativo existente.
     *
     * @param string $id
     * @param array<string, mixed> $data
     *
     * @return bool
     */
    public function update(string $id, array $data): Creative
    {
        $creative = $this->find($id);
        if (!$creative) {
            throw new \Exception("Creative with ID {$id} not found");
        }
        $creative->update($data);
        $updated = $creative->fresh();
        if (!$updated) {
            throw new \Exception("Failed to refresh creative after update");
        }
        return $updated;
    }

    /**
     * Deleta um criativo.
     *
     * @param string $id
     *
     * @return bool
     */
    public function delete(string $id): bool
    {
        return Creative::destroy($id) > 0;
    }

    /**
     * Encontra um criativo pelo seu ID.
     *
     * @param string $id
     *
     * @return Creative|null
     */
    public function find(string $id): ?Creative
    {
        return Creative::find($id);
    }

    /**
     * Retorna todos os criativos de uma campanha.
     *
     * @param int $campaignId
     *
     * @return Collection<int, Creative>
     */
    public function findByCampaign(int $campaignId): Collection
    {
        return Creative::where('campaign_id', $campaignId)->get();
    }

    /**
     * Retorna todos os criativos de uma campanha pelo ID da campanha.
     *
     * @param string $campaignId
     *
     * @return Collection<int, Creative>
     */
    public function findByCampaignId(string $campaignId): Collection
    {
        return Creative::where('campaign_id', $campaignId)->get();
    }
}
