<?php

namespace App\Domains\Activity\Events;

use App\Domains\Activity\Domain\ActivityLog;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma atividade é logada no sistema.
 */
class ActivityLogged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var ActivityLog a entidade de log de atividade
     */
    public ActivityLog $activityLog;

    /**
     * Create a new event instance.
     *
     * @param ActivityLog $activityLog
     */
    public function __construct(ActivityLog $activityLog)
    {
        $this->activityLog = $activityLog;
    }
}
