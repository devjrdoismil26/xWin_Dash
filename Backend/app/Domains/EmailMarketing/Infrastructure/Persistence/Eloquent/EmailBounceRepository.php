<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailBounce;
use App\Domains\EmailMarketing\Domain\EmailBounceRepositoryInterface;

class EmailBounceRepository implements EmailBounceRepositoryInterface
{
    protected EmailBounceModel $model;

    public function __construct(EmailBounceModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo registro de bounce de e-mail.
     *
     * @param array $data
     *
     * @return EmailBounce
     */
    public function create(array $data): EmailBounce
    {
        $bounceModel = $this->model->create($data);
        return EmailBounce::fromArray($bounceModel->toArray());
    }

    /**
     * Encontra um registro de bounce de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailBounce|null
     */
    public function find(int $id): ?EmailBounce
    {
        $bounceModel = $this->model->find($id);
        return $bounceModel ? EmailBounce::fromArray($bounceModel->toArray()) : null;
    }

    /**
     * Retorna bounces para um log de e-mail específico.
     *
     * @param int $emailLogId
     *
     * @return array<EmailBounce>
     */
    public function getByEmailLogId(int $emailLogId): array
    {
        return $this->model->where('email_log_id', $emailLogId)
                           ->get()
                           ->map(function ($item) {
                               return EmailBounce::fromArray($item->toArray());
                           })->toArray();
    }
}
