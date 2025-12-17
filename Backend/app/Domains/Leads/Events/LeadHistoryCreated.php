<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\LeadHistory;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo registro de histórico de Lead é criado.
 */
class LeadHistoryCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var LeadHistory o registro de histórico de Lead que foi criado
     */
    public LeadHistory $leadHistory;

    /**
     * Create a new event instance.
     *
     * @param LeadHistory $leadHistory
     */
    public function __construct(LeadHistory $leadHistory)
    {
        $this->leadHistory = $leadHistory;
    }
}
