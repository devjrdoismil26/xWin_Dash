<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraTemplateRepositoryInterface
{
    public function find(string $id): ?AuraTemplate;

    /**
     * @return Collection<int, AuraTemplate>
     */
    public function findByProjectId(string $projectId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraTemplate;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
