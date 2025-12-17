<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Domain\Notification;
use App\Domains\Core\Domain\NotificationRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator as ConcreteLengthAwarePaginator;

class NotificationRepository implements NotificationRepositoryInterface
{
    protected NotificationModel $model;

    public function __construct(NotificationModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova notificação.
     *
     * @param array<string, mixed> $data
     *
     * @return Notification
     */
    public function create(array $data): Notification
    {
        $notificationModel = NotificationModel::create($data);
        return Notification::fromArray($notificationModel->toArray());
    }

    /**
     * Encontra uma notificação pelo seu ID.
     *
     * @param string $id
     *
     * @return Notification|null
     */
    public function find(string $id): ?Notification
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\NotificationModel|null $notificationModel */
        $notificationModel = NotificationModel::find($id);
        return $notificationModel ? Notification::fromArray($notificationModel->toArray()) : null;
    }

    /**
     * @param string $userId
     * @return Collection<int, Notification>
     */
    public function findByUserId(string $userId): Collection
    {
        return NotificationModel::where('user_id', $userId)
            ->get()
            ->map(function (\Illuminate\Database\Eloquent\Model $model) {
                return Notification::fromArray($model->toArray());
            });
    }

    /**
     * @param string $id
     * @param array<string, mixed> $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\NotificationModel|null $notificationModel */
        $notificationModel = NotificationModel::find($id);
        if ($notificationModel) {
            return $notificationModel->update($data);
        }
        return false;
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return (bool)NotificationModel::destroy($id);
    }

    /**
     * Retorna todas as notificações paginadas para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return NotificationModel::where('user_id', $userId)->paginate($perPage);
    }

    /**
     * Marca uma notificação como lida.
     *
     * @param string $id
     *
     * @return bool
     */
    public function markAsRead(string $id): bool
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\NotificationModel|null $notificationModel */
        $notificationModel = NotificationModel::find($id);
        if ($notificationModel) {
            $notificationModel->read = true;
            return $notificationModel->save();
        }
        return false;
    }
}
