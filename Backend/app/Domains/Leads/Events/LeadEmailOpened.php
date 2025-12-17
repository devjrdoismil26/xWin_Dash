<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Domain\LeadEmail;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable; // Supondo que a entidade de domínio exista
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um Lead abre um e-mail.
 */
class LeadEmailOpened
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead que abriu o e-mail
     */
    public Lead $lead;

    /**
     * @var LeadEmail o e-mail que foi aberto
     */
    public LeadEmail $email;

    /**
     * Create a new event instance.
     *
     * @param Lead      $lead
     * @param LeadEmail $email
     */
    public function __construct(Lead $lead, LeadEmail $email)
    {
        $this->lead = $lead;
        $this->email = $email;
    }
}
