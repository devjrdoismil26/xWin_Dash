<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Domain\LeadEmail;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable; // Supondo que a entidade de domínio exista
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um Lead clica em um link de e-mail.
 */
class LeadEmailClicked
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead que clicou no link
     */
    public Lead $lead;

    /**
     * @var LeadEmail o e-mail relacionado ao clique
     */
    public LeadEmail $email;

    /**
     * @var string a URL que foi clicada
     */
    public string $clickedUrl;

    /**
     * Create a new event instance.
     *
     * @param Lead      $lead
     * @param LeadEmail $email
     * @param string    $clickedUrl
     */
    public function __construct(Lead $lead, LeadEmail $email, string $clickedUrl)
    {
        $this->lead = $lead;
        $this->email = $email;
        $this->clickedUrl = $clickedUrl;
    }
}
