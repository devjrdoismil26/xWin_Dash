<?php

namespace App\Domains\Core\Events;

use App\Domains\Core\Domain\Notification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma notificação é enviada com sucesso.
 */
class NotificationSentEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Notification a entidade da notificação que foi enviada
     */
    public Notification $notification;

    /**
     * @var string o canal pelo qual a notificação foi enviada (ex: 'database', 'mail', 'whatsapp')
     */
    public string $channel;

    /**
     * Create a new event instance.
     *
     * @param Notification $notification
     * @param string       $channel
     */
    public function __construct(Notification $notification, string $channel)
    {
        $this->notification = $notification;
        $this->channel = $channel;
    }
}
