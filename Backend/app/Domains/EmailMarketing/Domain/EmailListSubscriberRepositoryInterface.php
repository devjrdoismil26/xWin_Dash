<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailListSubscriberRepositoryInterface
{
    /**
     * Adiciona um assinante a uma lista de e-mail.
     *
     * @param int $emailListId
     * @param int $emailSubscriberId
     *
     * @return EmailListSubscriber
     */
    public function addSubscriber(int $emailListId, int $emailSubscriberId): EmailListSubscriber;

    /**
     * Remove um assinante de uma lista de e-mail.
     *
     * @param int $emailListId
     * @param int $emailSubscriberId
     *
     * @return bool
     */
    public function removeSubscriber(int $emailListId, int $emailSubscriberId): bool;

    /**
     * Verifica se um assinante está em uma lista.
     *
     * @param int $emailListId
     * @param int $emailSubscriberId
     *
     * @return bool
     */
    public function isSubscriberInList(int $emailListId, int $emailSubscriberId): bool;

    /**
     * Obtém todos os assinantes de uma lista de e-mail.
     *
     * @param int $emailListId
     *
     * @return array<EmailListSubscriber>
     */
    public function getSubscribersByList(int $emailListId): array;
}
