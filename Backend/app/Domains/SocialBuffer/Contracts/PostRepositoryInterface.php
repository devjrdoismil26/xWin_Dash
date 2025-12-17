<?php

namespace App\Domains\SocialBuffer\Contracts;

use App\Domains\SocialBuffer\Models\Post;
use App\Shared\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface PostRepositoryInterface extends RepositoryInterface
{
    public function find(string $id): ?Post;

    public function all(array $columns = ['*']): Collection;

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    public function create(array $data): Post;

    public function update(string $id, array $data): Post;

    public function delete(string $id): bool;

    public function findByProject(string $projectId): Collection;

    public function findByStatus(string $status): Collection;

    public function findByUser(string $userId): Collection;
}
