<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando o status de um Lead é atualizado.
 */
class LeadStatusUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead cujo status foi atualizado
     */
    public Lead $lead;

    /**
     * @var string o novo status do Lead
     */
    public string $newStatus;

    /**
     * Create a new event instance.
     *
     * @param Lead   $lead
     * @param string $newStatus
     */
    public function __construct(Lead $lead, string $newStatus)
    {
        $this->lead = $lead;
        $this->newStatus = $newStatus;
    }
}
