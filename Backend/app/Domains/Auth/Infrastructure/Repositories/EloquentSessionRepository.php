<?php

namespace App\Domains\Auth\Infrastructure\Repositories;

use App\Domains\Auth\Domain\Contracts\SessionRepositoryInterface;
use App\Domains\Auth\Domain\Entities\Session as SessionEntity;
use App\Domains\Auth\Infrastructure\Persistence\Eloquent\SessionModel;
use DateTimeImmutable;

class EloquentSessionRepository implements SessionRepositoryInterface
{
    public function findById(int $id): ?SessionEntity
    {
        $model = SessionModel::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    public function findByToken(string $token): ?SessionEntity
    {
        $model = SessionModel::where('token', $token)->first();
        return $model ? $this->toEntity($model) : null;
    }

    public function findByUserId(int $userId): array
    {
        return SessionModel::where('user_id', $userId)
            ->get()
            ->map(fn($model) => $this->toEntity($model))
            ->toArray();
    }

    public function create(array $data): SessionEntity
    {
        $model = SessionModel::create($data);
        return $this->toEntity($model);
    }

    public function updateActivity(int $id): bool
    {
        return SessionModel::where('id', $id)->update([
            'last_activity_at' => now()
        ]) > 0;
    }

    public function delete(int $id): bool
    {
        return SessionModel::destroy($id) > 0;
    }

    public function deleteByUserId(int $userId): bool
    {
        return SessionModel::where('user_id', $userId)->delete() > 0;
    }

    public function deleteExpired(): int
    {
        return SessionModel::where('expires_at', '<', now())->delete();
    }

    private function toEntity(SessionModel $model): SessionEntity
    {
        return new SessionEntity(
            id: $model->id,
            userId: $model->user_id,
            token: $model->token,
            ipAddress: $model->ip_address,
            userAgent: $model->user_agent,
            lastActivityAt: $model->last_activity_at ? new DateTimeImmutable($model->last_activity_at) : null,
            expiresAt: $model->expires_at ? new DateTimeImmutable($model->expires_at) : null,
            createdAt: $model->created_at ? new DateTimeImmutable($model->created_at) : null
        );
    }
}
