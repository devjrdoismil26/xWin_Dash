<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListSubscriberModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um assinante de e-mail é desanexado de uma lista de e-mail.
 */
class EmailListSubscriberDetached
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailListSubscriber o registro de assinante de lista de e-mail que foi desanexado
     */
    public EmailListSubscriberModel $emailListSubscriber;

    /**
     * Create a new event instance.
     *
     * @param EmailListSubscriber $emailListSubscriber
     */
    public function __construct(EmailListSubscriberModel $emailListSubscriber)
    {
        $this->emailListSubscriber = $emailListSubscriber;
    }
}
