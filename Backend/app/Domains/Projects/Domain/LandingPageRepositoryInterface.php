<?php

namespace App\Domains\Projects\Domain;

use Illuminate\Support\Collection;

interface LandingPageRepositoryInterface
{
    public function find(string $id): ?LandingPage;

    /**
     * @return Collection<int, LandingPage>
     */
    public function findByProjectId(string $projectId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): LandingPage;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
