<?php

namespace App\Application\Aura\UseCases;

use App\Application\Aura\Commands\CreateAuraChatCommand;
use App\Domains\Aura\Services\AuraChatService; // Supondo que este serviço exista

class CreateAuraChatUseCase
{
    protected AuraChatService $auraChatService;

    public function __construct(AuraChatService $auraChatService)
    {
        $this->auraChatService = $auraChatService;
    }

    /**
     * Executa o caso de uso para criar um novo chat do Aura.
     *
     * @param CreateAuraChatCommand $command
     *
     * @return mixed o chat criado
     */
    public function execute(CreateAuraChatCommand $command)
    {
        return $this->auraChatService->createChat(
            $command->userId,
            $command->chatType,
            $command->initialMessage,
        );
    }
}
