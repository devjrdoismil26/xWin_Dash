<?php

namespace App\Domains\Media\Contracts;

use App\Domains\Media\Models\Media;
use App\Shared\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface MediaRepositoryInterface extends RepositoryInterface
{
    public function find(string $id): ?Media;

    public function all(array $columns = ['*']): Collection;

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    public function create(array $data): Media;

    public function update(string $id, array $data): Media;

    public function delete(string $id): bool;

    public function findByFolder(string $folderId): Collection;

    public function findByType(string $type): Collection;

    public function findByProject(string $projectId): Collection;
}
