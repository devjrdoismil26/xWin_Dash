<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Commands\DeleteSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Handlers\DeleteSocialAccountHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteSocialAccountUseCase
{
    public function __construct(
        private DeleteSocialAccountHandler $deleteSocialAccountHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteSocialAccountCommand $command): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($command->userId, 'socialbuffer', 'delete_social_account');

            // Validar regras de negócio cross-module
            $this->validationService->validateSocialBufferBusinessRules($command->toArray());

            // Executar comando via handler
            $result = $this->deleteSocialAccountHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('social_account.deleted', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId
            ]);

            Log::info('Social account deleted successfully', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Conta social excluída com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting social account', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir conta social: ' . $e->getMessage()
            ];
        }
    }
}
