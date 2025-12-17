<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\LeadCustomValue;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um valor personalizado de Lead é atualizado.
 */
class LeadCustomValueUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var LeadCustomValue o valor personalizado de Lead que foi atualizado
     */
    public LeadCustomValue $customValue;

    /**
     * Create a new event instance.
     *
     * @param LeadCustomValue $customValue
     */
    public function __construct(LeadCustomValue $customValue)
    {
        $this->customValue = $customValue;
    }
}
