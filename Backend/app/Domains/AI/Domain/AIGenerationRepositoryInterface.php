<?php

namespace App\Domains\AI\Domain;

use Illuminate\Support\Collection;

interface AIGenerationRepositoryInterface
{
    public function find(string $id): ?AIGeneration;

    /**
     * @param string $userId
     * @return Collection<int, AIGeneration>
     */
    public function findAllByUserId(string $userId): Collection;

    /**
     * @param array<string, mixed> $data
     * @return AIGeneration
     */
    public function create(array $data): AIGeneration;

    /**
     * @param string $id
     * @param array<string, mixed> $data
     * @return bool
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
