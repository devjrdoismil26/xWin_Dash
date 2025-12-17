<?php

namespace App\Domains\Leads\Events;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma atividade de Lead é registrada.
 */
class LeadActivityRecorded
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Lead o Lead relacionado à atividade
     */
    public Lead $lead;

    /**
     * @var string o tipo da atividade (ex: 'call', 'email', 'meeting')
     */
    public string $activityType;

    /**
     * @var string a descrição da atividade
     */
    public string $description;

    /**
     * @var array dados adicionais da atividade
     */
    public array $properties;

    /**
     * Create a new event instance.
     *
     * @param Lead   $lead
     * @param string $activityType
     * @param string $description
     * @param array  $properties
     */
    public function __construct(Lead $lead, string $activityType, string $description, array $properties = [])
    {
        $this->lead = $lead;
        $this->activityType = $activityType;
        $this->description = $description;
        $this->properties = $properties;
    }
}
