<?php

namespace App\Domains\Leads\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo o model de usuário padrão do Laravel

/**
 * Evento disparado quando Leads são importados.
 */
class LeadImported
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var User o usuário que realizou a importação
     */
    public User $user;

    /**
     * @var string o caminho do arquivo importado
     */
    public string $filePath;

    /**
     * @var int o número de Leads importados
     */
    public int $importedCount;

    /**
     * Create a new event instance.
     *
     * @param User   $user
     * @param string $filePath
     * @param int    $importedCount
     */
    public function __construct(User $user, string $filePath, int $importedCount)
    {
        $this->user = $user;
        $this->filePath = $filePath;
        $this->importedCount = $importedCount;
    }
}
