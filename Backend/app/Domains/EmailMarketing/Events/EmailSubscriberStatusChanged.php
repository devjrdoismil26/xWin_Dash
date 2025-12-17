<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSubscriberModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando o status de um assinante de e-mail muda.
 */
class EmailSubscriberStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailSubscriber o assinante de e-mail cujo status foi alterado
     */
    public EmailSubscriberModel $emailSubscriber;

    /**
     * @var string o novo status do assinante
     */
    public string $newStatus;

    /**
     * Create a new event instance.
     *
     * @param EmailSubscriber $emailSubscriber
     * @param string          $newStatus
     */
    public function __construct(EmailSubscriberModel $emailSubscriber, string $newStatus)
    {
        $this->emailSubscriber = $emailSubscriber;
        $this->newStatus = $newStatus;
    }
}
