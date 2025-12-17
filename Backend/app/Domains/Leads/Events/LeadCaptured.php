<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo Lead é capturado.
 */
class LeadCaptured
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead que foi capturado
     */
    public Lead $lead;

    /**
     * @var string a fonte de onde o Lead foi capturado (ex: 'web_form', 'api', 'manual')
     */
    public string $source;

    /**
     * Create a new event instance.
     *
     * @param Lead   $lead
     * @param string $source
     */
    public function __construct(Lead $lead, string $source)
    {
        $this->lead = $lead;
        $this->source = $source;
    }
}
