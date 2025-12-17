<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Segment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um Segmento é processado.
 */
class SegmentProcessed
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Segment o Segmento que foi processado
     */
    public Segment $segment;

    /**
     * @var int o número de Leads encontrados no segmento
     */
    public int $leadsCount;

    /**
     * Create a new event instance.
     *
     * @param Segment $segment
     * @param int     $leadsCount
     */
    public function __construct(Segment $segment, int $leadsCount)
    {
        $this->segment = $segment;
        $this->leadsCount = $leadsCount;
    }
}
