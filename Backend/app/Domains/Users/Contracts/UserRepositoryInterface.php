<?php

namespace App\Domains\Users\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function find(string $id): ?\App\Domains\Users\Domain\User;

    /**
     * @param array<int, string> $columns
     * @return \Illuminate\Support\Collection<int, \App\Domains\Users\Domain\User>
     */
    public function all(array $columns = ['*']): \Illuminate\Support\Collection;

    /**
     * @param array<int, string> $columns
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): \App\Domains\Users\Domain\User;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): \App\Domains\Users\Domain\User;

    public function delete(string $id): bool;

    public function findByEmail(string $email): ?\App\Domains\Users\Domain\User;

    public function getAllPaginated(int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator;
}
