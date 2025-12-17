<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraFlowRepositoryInterface
{
    public function find(string $id): ?AuraFlow;

    /**
     * @return Collection<int, AuraFlow>
     */
    public function findByProjectId(string $projectId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraFlow;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
