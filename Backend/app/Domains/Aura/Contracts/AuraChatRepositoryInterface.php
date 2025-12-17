<?php

namespace App\Domains\Aura\Contracts;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel as AuraChat;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface AuraChatRepositoryInterface
{
    public function find(string $id): ?AuraChat;

    /**
     * @param list<string> $columns
     * @return Collection<int, AuraChat>
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * @param list<string> $columns
     * @return LengthAwarePaginator<AuraChat>
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraChat;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): AuraChat;

    public function delete(string $id): bool;

    /**
     * @return Collection<int, AuraChat>
     */
    public function findByConnection(string $connectionId): Collection;

    /**
     * @return Collection<int, AuraChat>
     */
    public function findByStatus(string $status): Collection;

    /**
     * @param array<string, mixed> $attributes
     * @param array<string, mixed> $values
     */
    public function firstOrCreate(array $attributes, array $values = []): AuraChat;
}
