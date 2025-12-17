<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailListSubscriber;
use App\Domains\EmailMarketing\Contracts\EmailListSubscriberRepositoryInterface;

class EmailListSubscriberRepository implements EmailListSubscriberRepositoryInterface
{
    protected EmailListSubscriberModel $model;

    public function __construct(EmailListSubscriberModel $model)
    {
        $this->model = $model;
    }

    /**
     * Adiciona um assinante a uma lista de e-mail.
     *
     * @param int $emailListId
     * @param int $emailSubscriberId
     *
     * @return EmailListSubscriber
     */
    public function addSubscriber(int $emailListId, int $emailSubscriberId): EmailListSubscriber
    {
        $subscriberModel = $this->model->create([
            'email_list_id' => $emailListId,
            'email_subscriber_id' => $emailSubscriberId,
        ]);
        return EmailListSubscriber::fromArray($subscriberModel->toArray());
    }

    /**
     * Remove um assinante de uma lista de e-mail.
     *
     * @param int $emailListId
     * @param int $emailSubscriberId
     *
     * @return bool
     */
    public function removeSubscriber(int $emailListId, int $emailSubscriberId): bool
    {
        return (bool) $this->model->where('email_list_id', $emailListId)
                                 ->where('email_subscriber_id', $emailSubscriberId)
                                 ->delete();
    }

    /**
     * Verifica se um assinante está em uma lista.
     *
     * @param int $emailListId
     * @param int $emailSubscriberId
     *
     * @return bool
     */
    public function isSubscriberInList(int $emailListId, int $emailSubscriberId): bool
    {
        return $this->model->where('email_list_id', $emailListId)
                                 ->where('email_subscriber_id', $emailSubscriberId)
                                 ->exists();
    }

    /**
     * Obtém todos os assinantes de uma lista de e-mail.
     *
     * @param int $emailListId
     *
     * @return array<EmailListSubscriber>
     */
    public function getSubscribersByList(int $emailListId): array
    {
        return $this->model->where('email_list_id', $emailListId)
                           ->get()
                           ->map(function ($item) {
                               return EmailListSubscriber::fromArray($item->toArray());
                           })->toArray();
    }
}
