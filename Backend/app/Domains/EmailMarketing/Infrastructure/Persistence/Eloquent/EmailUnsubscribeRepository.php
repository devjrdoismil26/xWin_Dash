<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailUnsubscribe;
use App\Domains\EmailMarketing\Domain\EmailUnsubscribeRepositoryInterface;

class EmailUnsubscribeRepository implements EmailUnsubscribeRepositoryInterface
{
    protected EmailUnsubscribeModel $model;

    public function __construct(EmailUnsubscribeModel $model)
    {
        $this->model = $model;
    }

    /**
     * Registra um novo cancelamento de inscrição.
     *
     * @param array $data
     *
     * @return EmailUnsubscribe
     */
    public function create(array $data): EmailUnsubscribe
    {
        $unsubscribeModel = $this->model->create($data);
        return EmailUnsubscribe::fromArray($unsubscribeModel->toArray());
    }

    /**
     * Encontra um registro de cancelamento de inscrição pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailUnsubscribe|null
     */
    public function find(int $id): ?EmailUnsubscribe
    {
        $unsubscribeModel = $this->model->find($id);
        return $unsubscribeModel ? EmailUnsubscribe::fromArray($unsubscribeModel->toArray()) : null;
    }

    /**
     * Verifica se um e-mail está cancelado para uma lista específica.
     *
     * @param string   $email
     * @param int|null $emailListId
     *
     * @return bool
     */
    public function isEmailUnsubscribed(string $email, ?int $emailListId = null): bool
    {
        $query = $this->model->where('email', $email);
        if ($emailListId !== null) {
            $query->where('email_list_id', $emailListId);
        }
        return $query->exists();
    }
}
