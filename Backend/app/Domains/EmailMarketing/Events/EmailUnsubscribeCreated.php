<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailUnsubscribeModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo registro de cancelamento de inscrição de e-mail é criado.
 */
class EmailUnsubscribeCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailUnsubscribe o registro de cancelamento de inscrição de e-mail que foi criado
     */
    public EmailUnsubscribeModel $emailUnsubscribe;

    /**
     * Create a new event instance.
     *
     * @param EmailUnsubscribe $emailUnsubscribe
     */
    public function __construct(EmailUnsubscribeModel $emailUnsubscribe)
    {
        $this->emailUnsubscribe = $emailUnsubscribe;
    }
}
