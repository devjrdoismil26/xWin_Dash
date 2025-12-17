<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSubscriberModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo assinante de e-mail é criado.
 */
class EmailSubscriberCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailSubscriber o assinante de e-mail que foi criado
     */
    public EmailSubscriberModel $emailSubscriber;

    /**
     * Create a new event instance.
     *
     * @param EmailSubscriber $emailSubscriber
     */
    public function __construct(EmailSubscriberModel $emailSubscriber)
    {
        $this->emailSubscriber = $emailSubscriber;
    }
}
