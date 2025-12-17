<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSegment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo segmento de e-mail é criado.
 */
class EmailSegmentCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailSegment o segmento de e-mail que foi criado
     */
    public EmailSegment $emailSegment;

    /**
     * Create a new event instance.
     *
     * @param EmailSegment $emailSegment
     */
    public function __construct(EmailSegment $emailSegment)
    {
        $this->emailSegment = $emailSegment;
    }
}
