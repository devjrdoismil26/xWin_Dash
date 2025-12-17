<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando a pontuação de um Lead é atualizada.
 */
class LeadScoreUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead cuja pontuação foi atualizada
     */
    public Lead $lead;

    /**
     * @var int a nova pontuação do Lead
     */
    public int $newScore;

    /**
     * Create a new event instance.
     *
     * @param Lead $lead
     * @param int  $newScore
     */
    public function __construct(Lead $lead, int $newScore)
    {
        $this->lead = $lead;
        $this->newScore = $newScore;
    }
}
