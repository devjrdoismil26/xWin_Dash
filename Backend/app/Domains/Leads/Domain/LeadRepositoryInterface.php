<?php

namespace App\Domains\Leads\Domain;

use Illuminate\Support\Collection;

interface LeadRepositoryInterface
{
    public function find(string $id): ?Lead;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): Lead;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
