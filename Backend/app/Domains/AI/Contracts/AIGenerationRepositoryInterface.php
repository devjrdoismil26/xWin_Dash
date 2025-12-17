<?php

namespace App\Domains\AI\Contracts;

use App\Domains\AI\DTOs\CreateAIGenerationDTO;
use App\Domains\AI\DTOs\UpdateAIGenerationDTO;
use App\Domains\AI\Enums\AIGenerationStatus;
use App\Domains\AI\Models\AIGeneration;
use App\Shared\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface AIGenerationRepositoryInterface extends RepositoryInterface
{
    /**
     * @param string $id
     * @return AIGeneration|null
     */
    public function find(string $id): ?AIGeneration;

    /**
     * @param array<string> $columns
     * @return Collection<int, AIGeneration>
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * @param int $perPage
     * @param array<string> $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * @param array $data
     * @return AIGeneration
     */
    public function create(array $data): AIGeneration;

    /**
     * @param string $id
     * @param array $data
     * @return AIGeneration
     */
    public function update(string $id, array $data): AIGeneration;

    public function delete(string $id): bool;

    /**
     * @param string $projectId
     * @return Collection<int, AIGeneration>
     */
    public function findByProject(string $projectId): Collection;

    /**
     * @param string $type
     * @return Collection<int, AIGeneration>
     */
    public function findByType(string $type): Collection;

    /**
     * @param AIGenerationStatus $status
     * @return Collection<int, AIGeneration>
     */
    public function findByStatus(AIGenerationStatus $status): Collection;
}
