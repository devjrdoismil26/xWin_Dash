<?php

namespace App\Domains\ADStool\Contracts;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\DTOs\UpdateADSCampaignDTO;
use App\Domains\ADStool\Enums\CampaignStatus;
use App\Domains\ADStool\Models\ADSCampaign;
use App\Shared\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ADSCampaignRepositoryInterface extends RepositoryInterface
{
    public function find(string $id): ?ADSCampaign;

    /**
     * @param array<string> $columns
     * @return Collection<int, ADSCampaign>
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * @param array<string> $columns
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): ADSCampaign;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): ADSCampaign;

    /**
     * Método específico para criar com DTO
     */
    public function createFromDTO(CreateADSCampaignDTO $data): ADSCampaign;

    /**
     * Método específico para atualizar com DTO
     */
    public function updateFromDTO(string $id, UpdateADSCampaignDTO $data): ADSCampaign;

    public function delete(string $id): bool;

    /**
     * @return Collection<int, ADSCampaign>
     */
    public function findByProject(string $projectId): Collection;

    /**
     * @return Collection<int, ADSCampaign>
     */
    public function findByStatus(CampaignStatus $status): Collection;
}
