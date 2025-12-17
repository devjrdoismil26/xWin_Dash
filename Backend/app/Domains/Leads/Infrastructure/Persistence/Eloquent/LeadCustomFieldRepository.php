<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Domain\LeadCustomField;
use App\Domains\Leads\Domain\LeadCustomFieldRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeadCustomFieldRepository implements LeadCustomFieldRepositoryInterface
{
    protected LeadCustomFieldModel $model;

    public function __construct(LeadCustomFieldModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo campo personalizado de Lead.
     *
     * @param array $data
     *
     * @return LeadCustomField
     */
    public function create(array $data): LeadCustomField
    {
        $fieldModel = $this->model->create($data);
        return LeadCustomField::fromArray($fieldModel->toArray());
    }

    /**
     * Encontra um campo personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadCustomField|null
     */
    public function find(int $id): ?LeadCustomField
    {
        $fieldModel = $this->model->find($id);
        return $fieldModel ? LeadCustomField::fromArray($fieldModel->toArray()) : null;
    }

    /**
     * Atualiza um campo personalizado de Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return LeadCustomField
     */
    public function update(int $id, array $data): LeadCustomField
    {
        $fieldModel = $this->model->find($id);
        if (!$fieldModel) {
            throw new \RuntimeException("Lead Custom Field not found.");
        }
        $fieldModel->update($data);
        return LeadCustomField::fromArray($fieldModel->toArray());
    }

    /**
     * Deleta um campo personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Retorna todos os campos personalizados de Lead paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return LeadCustomField::fromArray($item->toArray());
        });
    }
}
