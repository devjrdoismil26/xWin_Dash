<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\SocialAccount;
use App\Domains\SocialBuffer\Domain\SocialAccountRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class SocialAccountRepository implements SocialAccountRepositoryInterface
{
    public function __construct(private readonly SocialAccountModel $model)
    {
    }

    public function find(string $id): ?SocialAccount
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserId(string $userId): Collection
    {
        $models = $this->model->where('user_id', $userId)->get();
        return $models->map(fn (SocialAccountModel $model) => $this->toDomain($model));
    }

    public function create(array $data): SocialAccount
    {
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->delete();
    }

    private function toDomain(SocialAccountModel $model): SocialAccount
    {
        return new SocialAccount(
            id: $model->id,
            userId: $model->user_id,
            platform: $model->platform,
            accountId: $model->account_id,
            isActive: $model->is_active,
            accountName: $model->account_name,
            username: $model->username,
            accessToken: $model->access_token,
            refreshToken: $model->refresh_token,
            tokenExpiresAt: $model
                ->token_expires_at ? DateTimeImmutable::createFromMutable($model->token_expires_at) : null,
            accountMetadata: $model->account_metadata,
            postingPermissions: $model->posting_permissions,
            lastUsedAt: $model->last_used_at ? DateTimeImmutable::createFromMutable($model->last_used_at) : null,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
