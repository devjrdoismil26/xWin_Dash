<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailList;
use App\Domains\EmailMarketing\Domain\EmailListRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmailListRepository implements EmailListRepositoryInterface
{
    protected EmailListModel $model;

    public function __construct(EmailListModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova lista de e-mail.
     *
     * @param array $data
     *
     * @return EmailList
     */
    public function create(array $data): EmailList
    {
        $listModel = $this->model->create($data);
        return EmailList::fromArray($listModel->toArray());
    }

    /**
     * Encontra uma lista de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailList|null
     */
    public function find(int $id): ?EmailList
    {
        $listModel = $this->model->find($id);
        return $listModel ? EmailList::fromArray($listModel->toArray()) : null;
    }

    /**
     * Atualiza uma lista de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailList
     */
    public function update(int $id, array $data): EmailList
    {
        $listModel = $this->model->find($id);
        if (!$listModel) {
            throw new \RuntimeException("Email List not found.");
        }
        $listModel->update($data);
        return EmailList::fromArray($listModel->toArray());
    }

    /**
     * Deleta uma lista de e-mail pelo seu ID.
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
     * Retorna todas as listas de e-mail paginadas para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return EmailList::fromArray($item->toArray());
        });
    }
}
