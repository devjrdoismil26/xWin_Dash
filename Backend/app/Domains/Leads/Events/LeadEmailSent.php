<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Domain\LeadEmail;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable; // Supondo que a entidade de domínio exista
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um e-mail é enviado a um Lead.
 */
class LeadEmailSent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead para quem o e-mail foi enviado
     */
    public Lead $lead;

    /**
     * @var LeadEmail o e-mail que foi enviado
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
