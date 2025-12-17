<?php

namespace App\Domains\Integrations\Infrastructure\Persistence\Eloquent;

use App\Domains\Integrations\Domain\ApiCredential;
use App\Domains\Integrations\Domain\ApiCredentialRepositoryInterface;

class ApiCredentialRepository implements ApiCredentialRepositoryInterface
{
    public function __construct(private readonly ApiCredentialModel $model)
    {
    }

    public function find(string $id): ?ApiCredential
    {
        $model = $this->model->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserIdAndType(string $userId, string $integrationType): ?ApiCredential
    {
        $model = $this->model->where('user_id', $userId)->where('integration_type', $integrationType)->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): ApiCredential
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

    private function toDomain(ApiCredentialModel $model): ApiCredential
    {
        return new ApiCredential(
            id: $model->id,
            userId: $model->user_id,
            integrationType: $model->integration_type,
            value: $model->value,
        );
    }
}
