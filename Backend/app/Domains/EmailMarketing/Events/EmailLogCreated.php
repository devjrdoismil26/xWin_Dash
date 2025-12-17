<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailLogModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo log de e-mail é criado.
 */
class EmailLogCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailLog o log de e-mail que foi criado
     */
    public EmailLogModel $emailLog;

    /**
     * Create a new event instance.
     *
     * @param EmailLog $emailLog
     */
    public function __construct(EmailLogModel $emailLog)
    {
        $this->emailLog = $emailLog;
    }
}
