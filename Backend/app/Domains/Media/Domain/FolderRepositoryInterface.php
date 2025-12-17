<?php

namespace App\Domains\Media\Domain;

use Illuminate\Support\Collection;

interface FolderRepositoryInterface
{
    public function find(string $id): ?Folder;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): Folder;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
