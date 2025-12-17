<?php

namespace App\Domains\Users\Services;

use App\Domains\Users\Contracts\UserRepositoryInterface;
use App\Domains\Users\Domain\User; // Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService
{
    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Cria um novo usuário.
     *
     * @param array $data Dados do usuário (name, email, password, role, etc.).
     *
     * @return User
     */
    /**
     * @param array<string, mixed> $data
     */
    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data);
        Log::info("Usuário criado: {$user->email} (ID: {$user->id}).");
        return $user;
    }

    /**
     * Obtém um usuário pelo seu ID.
     *
     * @param int $id o ID do usuário
     *
     * @return User|null
     */
    public function getUserById(int $id): ?User
    {
        return $this->userRepository->find((string) $id);
    }

    /**
     * Atualiza um usuário existente.
     *
     * @param int   $id   o ID do usuário
     * @param array $data dados para atualização
     *
     * @return User
     */
    /**
     * @param array<string, mixed> $data
     */
    public function updateUser(int $id, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user = $this->userRepository->update((string) $id, $data);
        Log::info("Usuário atualizado: {$user->email} (ID: {$user->id}).");
        return $user;
    }

    /**
     * Deleta um usuário pelo seu ID (soft delete).
     *
     * @param int $id o ID do usuário
     *
     * @return bool
     */
    public function deleteUser(int $id): bool
    {
        $user = $this->userRepository->find((string) $id);
        if (!$user) {
            return false;
        }
        // Em um soft delete, você pode mudar o status para 'inactive' ou 'deleted'
        try {
            $this->userRepository->update((string) $id, ['status' => 'deleted']);
            Log::info("Usuário ID: {$id} marcado como deletado (soft delete).");
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Força a exclusão de um usuário (hard delete).
     *
     * @param int $id o ID do usuário
     *
     * @return bool
     */
    public function forceDeleteUser(int $id): bool
    {
        $success = $this->userRepository->delete((string) $id);
        if ($success) {
            Log::info("Usuário ID: {$id} forçadamente deletado (hard delete).");
        }
        return $success;
    }

    /**
     * Desativa um usuário.
     *
     * @param int $id o ID do usuário
     *
     * @return User
     */
    public function deactivateUser(int $id): User
    {
        $user = $this->userRepository->update((string) $id, ['status' => 'inactive']);
        Log::info("Usuário ID: {$id} desativado.");
        return $user;
    }

    /**
     * Retorna todos os usuários paginados.
     *
     * @param int $perPage número de itens por página
     *
     * @return LengthAwarePaginator
     */
    public function getAllUsers(int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->getAllPaginated($perPage);
    }
}
