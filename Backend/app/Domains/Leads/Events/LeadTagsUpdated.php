<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando as tags de um Lead são atualizadas.
 */
class LeadTagsUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead cujas tags foram atualizadas
     */
    public Lead $lead;

    /**
     * @var array as novas tags do Lead
     */
    public array $newTags;

    /**
     * Create a new event instance.
     *
     * @param Lead  $lead
     * @param array $newTags
     */
    public function __construct(Lead $lead, array $newTags)
    {
        $this->lead = $lead;
        $this->newTags = $newTags;
    }
}
