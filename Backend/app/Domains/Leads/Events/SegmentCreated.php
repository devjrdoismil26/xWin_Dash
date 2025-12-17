<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Segment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um novo Segmento é criado.
 */
class SegmentCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Segment o Segmento que foi criado
     */
    public Segment $segment;

    /**
     * Create a new event instance.
     *
     * @param Segment $segment
     */
    public function __construct(Segment $segment)
    {
        $this->segment = $segment;
    }
}
