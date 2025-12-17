<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando os segmentos de um Lead são sincronizados.
 */
class LeadSegmentsSynchronized
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead cujos segmentos foram sincronizados
     */
    public Lead $lead;

    /**
     * @var array os IDs dos segmentos aos quais o Lead agora pertence
     */
    public array $segmentIds;

    /**
     * Create a new event instance.
     *
     * @param Lead  $lead
     * @param array $segmentIds
     */
    public function __construct(Lead $lead, array $segmentIds)
    {
        $this->lead = $lead;
        $this->segmentIds = $segmentIds;
    }
}
