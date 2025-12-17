<?php

namespace App\Domains\Auth\Infrastructure\Repositories;

use App\Domains\Auth\Domain\Contracts\UserRepositoryInterface;
use App\Domains\Auth\Domain\Entities\User as UserEntity;
use App\Models\User as UserModel;
use DateTimeImmutable;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?UserEntity
    {
        $model = UserModel::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    public function findByEmail(string $email): ?UserEntity
    {
        $model = UserModel::where('email', $email)->first();
        return $model ? $this->toEntity($model) : null;
    }

    public function create(array $data): UserEntity
    {
        $model = UserModel::create($data);
        return $this->toEntity($model);
    }

    public function update(int $id, array $data): UserEntity
    {
        $model = UserModel::findOrFail($id);
        $model->update($data);
        return $this->toEntity($model);
    }

    public function delete(int $id): bool
    {
        return UserModel::destroy($id) > 0;
    }

    public function verifyEmail(int $id): bool
    {
        return UserModel::where('id', $id)->update([
            'email_verified_at' => now()
        ]) > 0;
    }

    public function updatePassword(int $id, string $password): bool
    {
        return UserModel::where('id', $id)->update([
            'password' => $password
        ]) > 0;
    }

    private function toEntity(UserModel $model): UserEntity
    {
        return new UserEntity(
            id: $model->id,
            name: $model->name,
            email: $model->email,
            password: $model->password,
            emailVerifiedAt: $model->email_verified_at ? new DateTimeImmutable($model->email_verified_at) : null,
            isActive: $model->is_active ?? true,
            createdAt: $model->created_at ? new DateTimeImmutable($model->created_at) : null,
            updatedAt: $model->updated_at ? new DateTimeImmutable($model->updated_at) : null
        );
    }
}
