<?php

namespace App\Domains\Core\Contracts;

use App\Domains\Core\Domain\Notification; // Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationRepositoryInterface
{
    /**
     * Cria uma nova notificação.
     *
     * @param array<string, mixed> $data
     *
     * @return Notification
     */
    public function create(array $data): Notification;

    /**
     * Encontra uma notificação pelo seu ID.
     *
     * @param int $id
     *
     * @return Notification|null
     */
    public function find(int $id): ?Notification;

    /**
     * Retorna todas as notificações paginadas para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Marca uma notificação como lida.
     *
     * @param int $id
     *
     * @return bool
     */
    public function markAsRead(int $id): bool;
}
