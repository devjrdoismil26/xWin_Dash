<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraStatsRepositoryInterface
{
    public function find(string $id): ?AuraStats;

    /**
     * @return Collection<int, AuraStats>
     */
    public function all(): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraStats;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
