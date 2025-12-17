<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailTemplate;
use App\Domains\EmailMarketing\Contracts\EmailTemplateRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmailTemplateRepository implements EmailTemplateRepositoryInterface
{
    protected EmailTemplateModel $model;

    public function __construct(EmailTemplateModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo template de e-mail.
     *
     * @param array $data
     *
     * @return EmailTemplate
     */
    public function create(array $data): EmailTemplate
    {
        $templateModel = $this->model->create($data);
        return EmailTemplate::fromArray($templateModel->toArray());
    }

    /**
     * Encontra um template de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailTemplate|null
     */
    public function find(int $id): ?EmailTemplate
    {
        $templateModel = $this->model->find($id);
        return $templateModel ? EmailTemplate::fromArray($templateModel->toArray()) : null;
    }

    /**
     * Atualiza um template de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailTemplate
     */
    public function update(int $id, array $data): EmailTemplate
    {
        $templateModel = $this->model->find($id);
        if (!$templateModel) {
            throw new \RuntimeException("Email Template not found.");
        }
        $templateModel->update($data);
        return EmailTemplate::fromArray($templateModel->toArray());
    }

    /**
     * Deleta um template de e-mail pelo seu ID.
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
     * Retorna todos os templates de e-mail paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return EmailTemplate::fromArray($item->toArray());
        });
    }
}
