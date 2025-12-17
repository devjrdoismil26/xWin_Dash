<?php

namespace App\Domains\Leads\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo o model de usuário padrão do Laravel

/**
 * Evento disparado quando Leads são exportados.
 */
class LeadExported
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var User o usuário que realizou a exportação
     */
    public User $user;

    /**
     * @var array os filtros usados para a exportação
     */
    public array $filters;

    /**
     * @var string o caminho do arquivo exportado
     */
    public string $filePath;

    /**
     * Create a new event instance.
     *
     * @param User   $user
     * @param array  $filters
     * @param string $filePath
     */
    public function __construct(User $user, array $filters, string $filePath)
    {
        $this->user = $user;
        $this->filters = $filters;
        $this->filePath = $filePath;
    }
}
