<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Commands\UpdateSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Handlers\UpdateSocialAccountHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateSocialAccountUseCase
{
    public function __construct(
        private UpdateSocialAccountHandler $updateSocialAccountHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateSocialAccountCommand $command): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($command->userId, 'socialbuffer', 'update_social_account');

            // Validar regras de negócio cross-module
            $this->validationService->validateSocialBufferBusinessRules($command->toArray());

            // Executar comando via handler
            $result = $this->updateSocialAccountHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('social_account.updated', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId,
                'changes' => $command->toArray()
            ]);

            Log::info('Social account updated successfully', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Conta social atualizada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating social account', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar conta social: ' . $e->getMessage()
            ];
        }
    }
}
