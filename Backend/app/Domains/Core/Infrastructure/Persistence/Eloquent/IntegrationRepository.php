<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Domain\Integration;
use App\Domains\Core\Domain\IntegrationRepositoryInterface;

class IntegrationRepository implements IntegrationRepositoryInterface
{
    protected IntegrationModel $model;

    public function __construct(IntegrationModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova integração.
     *
     * @param array<string, mixed> $data
     *
     * @return Integration
     */
    public function create(array $data): Integration
    {
        $integrationModel = IntegrationModel::create($data);
        return Integration::fromArray($integrationModel->toArray());
    }

    /**
     * Encontra uma integração pelo seu ID.
     *
     * @param int $id
     *
     * @return Integration|null
     */
    public function find(int $id): ?Integration
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationModel|null $integrationModel */
        $integrationModel = IntegrationModel::find($id);
        return $integrationModel ? Integration::fromArray($integrationModel->toArray()) : null;
    }

    /**
     * Encontra uma integração pelo seu nome e tipo.
     *
     * @param string $name
     * @param string $type
     *
     * @return Integration|null
     */
    public function findByNameAndType(string $name, string $type): ?Integration
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationModel|null $integrationModel */
        $integrationModel = IntegrationModel::where('name', $name)->where('type', $type)->first();
        return $integrationModel ? Integration::fromArray($integrationModel->toArray()) : null;
    }

    /**
     * Atualiza uma integração existente.
     *
     * @param int   $id
     * @param array<string, mixed> $data
     *
     * @return Integration
     */
    public function update(int $id, array $data): Integration
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationModel|null $integrationModel */
        $integrationModel = IntegrationModel::find($id);
        if (!$integrationModel) {
            throw new \RuntimeException("Integration not found.");
        }
        $integrationModel->update($data);
        return Integration::fromArray($integrationModel->toArray());
    }

    /**
     * Deleta uma integração pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool
    {
        return (bool) IntegrationModel::destroy($id);
    }

    /**
     * Retorna todas as integrações.
     *
     * @return array<Integration>
     */
    public function getAll(): array
    {
        return IntegrationModel::all()->map(function ($item) {
            return Integration::fromArray($item->toArray());
        })->toArray();
    }
}
