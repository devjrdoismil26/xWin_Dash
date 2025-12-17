<?php

namespace App\Domains\Users\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Contracts\UserRepositoryInterface; // Supondo que a entidade de domínio exista
use App\Domains\Users\Domain\User;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    protected UserModel $model;

    public function __construct(UserModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo usuário.
     *
     * @param array $data
     *
     * @return User
     */
    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): User
    {
        /** @var UserModel $userModel */
        $userModel = UserModel::query()->create($data);
        return User::fromArray($userModel->toArray());
    }

    /**
     * Encontra um usuário pelo seu ID.
     *
     * @param string $id
     *
     * @return User|null
     */
    public function find(string $id): ?User
    {
        /** @var UserModel|null $userModel */
        $userModel = UserModel::query()->find($id);
        return $userModel ? User::fromArray($userModel->toArray()) : null;
    }

    /**
     * Encontra um usuário pelo seu e-mail.
     *
     * @param string $email
     *
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        /** @var UserModel|null $userModel */
        $userModel = UserModel::query()->where('email', $email)->first();
        return $userModel ? User::fromArray($userModel->toArray()) : null;
    }

    /**
     * Atualiza um usuário existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return User
     */
    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): User
    {
        /** @var UserModel|null $userModel */
        $userModel = UserModel::query()->find($id);
        if (!$userModel) {
            throw new \RuntimeException("User not found.");
        }
        $userModel->update($data);
        return User::fromArray($userModel->toArray());
    }

    /**
     * Deleta um usuário pelo seu ID.
     *
     * @param string $id
     *
     * @return bool
     */
    public function delete(string $id): bool
    {
        return (bool) UserModel::query()->where('id', $id)->delete();
    }

    /**
     * Retorna todos os usuários paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = UserModel::query()->paginate($perPage);
        $paginator->getCollection()->transform(function ($item) {
            /** @var UserModel $item */
            $data = $item->toArray();
            return User::fromArray([
                'id' => $data['id'],
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'] ?? null,
                'status' => $data['is_active'] ? 'active' : 'inactive',
                'role' => 'member', // Default role
                'email_verified_at' => $data['email_verified_at'],
                'created_at' => $data['created_at'],
                'updated_at' => $data['updated_at'],
            ]);
        });
        return $paginator;
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): \Illuminate\Pagination\LengthAwarePaginator
    {
        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = UserModel::query()->select($columns)->paginate($perPage);
        return $paginator;
    }

    /**
     * @return \Illuminate\Support\Collection<int, User>
     */
    public function all(array $columns = ['*']): \Illuminate\Support\Collection
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, UserModel> $models */
        $models = UserModel::query()->get($columns);
        return $models->map(function ($item) {
            /** @var UserModel $item */
            return User::fromArray($item->toArray());
        });
    }
}
