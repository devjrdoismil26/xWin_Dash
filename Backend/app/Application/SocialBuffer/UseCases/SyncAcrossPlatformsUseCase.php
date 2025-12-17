<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\SyncAcrossPlatformsCommand;
use App\Domains\SocialBuffer\Services\SocialAccountService; // Supondo que este serviço exista

class SyncAcrossPlatformsUseCase
{
    protected SocialAccountService $socialAccountService;

    public function __construct(SocialAccountService $socialAccountService)
    {
        $this->socialAccountService = $socialAccountService;
    }

    /**
     * Executa o caso de uso para sincronizar dados entre plataformas.
     *
     * @param SyncAcrossPlatformsCommand $command
     *
     * @return array o resultado da sincronização
     */
    public function execute(SyncAcrossPlatformsCommand $command): array
    {
        return $this->socialAccountService->syncAccounts(
            $command->userId,
            $command->platforms,
            $command->syncType,
        );
    }
}
