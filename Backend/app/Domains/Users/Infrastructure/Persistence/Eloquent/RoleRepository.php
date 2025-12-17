<?php

namespace App\Domains\Users\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Domain\Role;
use App\Domains\Users\Domain\RoleRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class RoleRepository implements RoleRepositoryInterface
{
    /**
     * @SuppressWarnings("PHPMD.UnusedPrivateField")
     */
    public function __construct(private readonly RoleModel $_model)
    {
    }

    public function find(string $id): ?Role
    {
        /** @var RoleModel|null $model */
        $model = RoleModel::query()->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByName(string $name): ?Role
    {
        /** @var RoleModel|null $model */
        $model = RoleModel::query()->where('name', $name)->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function all(): Collection
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, RoleModel> $models */
        $models = RoleModel::query()->get();

        return $models->map(fn (RoleModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Role
    {
        /** @var RoleModel $model */
        $model = RoleModel::query()->create($data);

        return $this->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        /** @var RoleModel|null $model */
        $model = RoleModel::query()->find($id);
        if (!$model) {
            return false;
        }

        return (bool) $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var RoleModel|null $model */
        $model = RoleModel::query()->find($id);
        if (!$model) {
            return false;
        }

        return (bool) $model->delete();
    }

    private function toDomain(RoleModel $model): Role
    {
        return new Role(
            name: $model->name,
            slug: (string) $model->guard_name,
            description: $model->description,
            id: (int) $model->id,
            createdAt: $model->created_at ? \DateTime::createFromImmutable(DateTimeImmutable::createFromMutable($model->created_at)) : null,
            updatedAt: $model->updated_at ? \DateTime::createFromImmutable(DateTimeImmutable::createFromMutable($model->updated_at)) : null,
        );
    }
}
