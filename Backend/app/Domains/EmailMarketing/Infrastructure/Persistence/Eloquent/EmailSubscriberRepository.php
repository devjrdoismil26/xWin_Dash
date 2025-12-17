<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailSubscriber;
use App\Domains\EmailMarketing\Contracts\EmailSubscriberRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmailSubscriberRepository implements EmailSubscriberRepositoryInterface
{
    protected EmailSubscriberModel $model;

    public function __construct(EmailSubscriberModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo assinante de e-mail.
     *
     * @param array $data
     *
     * @return EmailSubscriber
     */
    public function create(array $data): EmailSubscriber
    {
        $subscriberModel = $this->model->create($data);
        return EmailSubscriber::fromArray($subscriberModel->toArray());
    }

    /**
     * Encontra um assinante de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailSubscriber|null
     */
    public function find(int $id): ?EmailSubscriber
    {
        $subscriberModel = $this->model->find($id);
        return $subscriberModel ? EmailSubscriber::fromArray($subscriberModel->toArray()) : null;
    }

    /**
     * Encontra um assinante de e-mail pelo seu endereço de e-mail.
     *
     * @param string $email
     *
     * @return EmailSubscriber|null
     */
    public function findByEmail(string $email): ?EmailSubscriber
    {
        $subscriberModel = $this->model->where('email', $email)->first();
        return $subscriberModel ? EmailSubscriber::fromArray($subscriberModel->toArray()) : null;
    }

    /**
     * Atualiza um assinante de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailSubscriber
     */
    public function update(int $id, array $data): EmailSubscriber
    {
        $subscriberModel = $this->model->find($id);
        if (!$subscriberModel) {
            throw new \RuntimeException("Email Subscriber not found.");
        }
        $subscriberModel->update($data);
        return EmailSubscriber::fromArray($subscriberModel->toArray());
    }

    /**
     * Deleta um assinante de e-mail pelo seu ID.
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
     * Retorna todos os assinantes de e-mail paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage)->through(function ($item) {
            return EmailSubscriber::fromArray($item->toArray());
        });
    }
}
