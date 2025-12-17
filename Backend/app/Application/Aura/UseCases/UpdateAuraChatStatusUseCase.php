<?php

namespace App\Application\Aura\UseCases;

use App\Application\Aura\Commands\UpdateAuraChatStatusCommand;
use App\Domains\Aura\Services\AuraChatService; // Supondo que este serviço exista

class UpdateAuraChatStatusUseCase
{
    protected AuraChatService $auraChatService;

    public function __construct(AuraChatService $auraChatService)
    {
        $this->auraChatService = $auraChatService;
    }

    /**
     * Executa o caso de uso para atualizar o status de um chat do Aura.
     *
     * @param UpdateAuraChatStatusCommand $command
     *
     * @return mixed o chat atualizado
     */
    public function execute(UpdateAuraChatStatusCommand $command)
    {
        return $this->auraChatService->updateChatStatus($command->chatId, $command->newStatus);
    }
}
