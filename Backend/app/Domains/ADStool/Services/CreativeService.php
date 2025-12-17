<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\Domain\CreativeRepositoryInterface;
use App\Domains\ADStool\Models\Creative;
use Illuminate\Support\Facades\Auth;

/**
 * Serviço para gerenciar a lógica de negócio de Criativos de Anúncio.
 */
class CreativeService
{
    /**
     * @var CreativeRepositoryInterface
     */
    protected CreativeRepositoryInterface $creativeRepository;

    /**
     * @param CreativeRepositoryInterface $creativeRepository
     */
    public function __construct(CreativeRepositoryInterface $creativeRepository)
    {
        $this->creativeRepository = $creativeRepository;
    }

    /**
     * Cria um novo criativo.
     *
     * @param array<string, mixed> $data
     *
     * @return Creative
     */
    public function createCreative(array $data): Creative
    {
        $data['user_id'] = Auth::id();
        return $this->creativeRepository->create($data);
    }

    /**
     * Atualiza um criativo existente.
     *
     * @param int   $creativeId
     * @param array<string, mixed> $data
     *
     * @return Creative
     */
    public function updateCreative(int $creativeId, array $data): Creative
    {
        return $this->creativeRepository->update((string) $creativeId, $data);
    }

    /**
     * Deleta um criativo.
     *
     * @param int $creativeId
     *
     * @return bool
     */
    public function deleteCreative(int $creativeId): bool
    {
        return $this->creativeRepository->delete((string) $creativeId);
    }

    /**
     * Encontra um criativo pelo seu ID.
     *
     * @param int $creativeId
     *
     * @return Creative|null
     */
    public function findCreativeById(int $creativeId): ?Creative
    {
        return $this->creativeRepository->find((string) $creativeId);
    }

    /**
     * Retorna todos os criativos de uma campanha.
     *
     * @param int $campaignId
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Creative>
     */
    public function getCreativesForCampaign(int $campaignId)
    {
        return $this->creativeRepository->findByCampaignId((string) $campaignId);
    }
}
