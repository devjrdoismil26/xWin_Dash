<?php

namespace App\Domains\Users\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Domain\UserPreference;
use App\Domains\Users\Domain\UserPreferenceRepositoryInterface;
use DateTimeImmutable;

class UserPreferenceRepository implements UserPreferenceRepositoryInterface
{
    /**
     * @SuppressWarnings("PHPMD.UnusedPrivateField")
     */
    public function __construct(private readonly UserPreferenceModel $_model)
    {
    }

    public function find(string $id): ?UserPreference
    {
        /** @var UserPreferenceModel|null $model */
        $model = UserPreferenceModel::query()->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserId(string $userId): ?UserPreference
    {
        /** @var UserPreferenceModel|null $model */
        $model = UserPreferenceModel::query()->where('user_id', $userId)->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): UserPreference
    {
        /** @var UserPreferenceModel $model */
        $model = UserPreferenceModel::query()->create($data);

        return $this->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        /** @var UserPreferenceModel|null $model */
        $model = UserPreferenceModel::query()->find($id);
        if (!$model) {
            return false;
        }

        return (bool) $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var UserPreferenceModel|null $model */
        $model = UserPreferenceModel::query()->find($id);
        if (!$model) {
            return false;
        }

        return (bool) $model->delete();
    }

    private function toDomain(UserPreferenceModel $model): UserPreference
    {
        return new UserPreference(
            userId: (int) $model->user_id,
            theme: (string) ($model->theme ?? 'light'),
            notificationsEnabled: (bool) $model->notifications_enabled,
            language: (string) ($model->locale ?? 'en'),
            id: (int) $model->id,
            createdAt: $model->created_at ? \DateTime::createFromImmutable(DateTimeImmutable::createFromMutable($model->created_at)) : null,
            updatedAt: $model->updated_at ? \DateTime::createFromImmutable(DateTimeImmutable::createFromMutable($model->updated_at)) : null,
        );
    }
}
