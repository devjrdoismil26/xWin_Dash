<?php

namespace App\Domains\Projects\Events;

use App\Domains\Projects\Domain\Project;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando o status de um projeto muda.
 */
class ProjectStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Project o projeto cujo status foi alterado
     */
    public Project $project;

    /**
     * @var string o novo status do projeto
     */
    public string $newStatus;

    /**
     * Create a new event instance.
     *
     * @param Project $project
     * @param string  $newStatus
     */
    public function __construct(Project $project, string $newStatus)
    {
        $this->project = $project;
        $this->newStatus = $newStatus;
    }
}
