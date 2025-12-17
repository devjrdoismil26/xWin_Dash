<?php

namespace App\Domains\Core\Patterns\Strategy;

use App\Domains\Core\Domain\Notification;

// Supondo que a entidade de domínio exista

interface NotificationStrategy
{
    /**
     * Envia uma notificação.
     *
     * @param Notification $notification a notificação a ser enviada
     *
     * @return bool true se a notificação foi enviada com sucesso, false caso contrário
     */
    public function send(Notification $notification): bool;
}
