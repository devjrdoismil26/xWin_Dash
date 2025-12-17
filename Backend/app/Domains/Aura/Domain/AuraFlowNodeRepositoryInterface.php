<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraFlowNodeRepositoryInterface
{
    public function find(string $id): ?AuraFlowNode;

    /**
     * @return Collection<int, AuraFlowNode>
     */
    public function findByFlowId(string $flowId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraFlowNode;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
