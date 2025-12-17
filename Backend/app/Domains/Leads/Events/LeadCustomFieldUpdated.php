<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\LeadCustomField;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um campo personalizado de Lead é atualizado.
 */
class LeadCustomFieldUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var LeadCustomField o campo personalizado de Lead que foi atualizado
     */
    public LeadCustomField $customField;

    /**
     * Create a new event instance.
     *
     * @param LeadCustomField $customField
     */
    public function __construct(LeadCustomField $customField)
    {
        $this->customField = $customField;
    }
}
