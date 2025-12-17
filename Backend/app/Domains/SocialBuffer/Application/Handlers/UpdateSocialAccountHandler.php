<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\UpdateSocialAccountCommand;
use App\Domains\SocialBuffer\Domain\Repositories\SocialAccountRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\SocialAccountService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class UpdateSocialAccountHandler
{
    public function __construct(
        private SocialAccountRepositoryInterface $socialAccountRepository,
        private SocialAccountService $socialAccountService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(UpdateSocialAccountCommand $command): array
    {
        try {
            // Buscar a conta existente
            $account = $this->socialAccountRepository->findById($command->accountId);

            if (!$account) {
                throw new \Exception('Conta social não encontrada');
            }

            // Validar permissões
            if ($account->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para editar esta conta');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Se as credenciais foram atualizadas, validar com a plataforma
            if ($command->accessToken || $command->refreshToken) {
                $validationResult = $this->socialMediaService->validateAccountCredentials(
                    $account->platform,
                    $command->accessToken ?? $account->access_token,
                    $command->refreshToken ?? $account->refresh_token
                );

                if (!$validationResult['valid']) {
                    throw new \Exception('Credenciais inválidas: ' . $validationResult['message']);
                }
            }

            // Atualizar a conta
            $updateData = array_filter([
                'username' => $command->username,
                'access_token' => $command->accessToken,
                'refresh_token' => $command->refreshToken,
                'token_expires_at' => $command->tokenExpiresAt,
                'is_active' => $command->isActive,
                'profile_data' => $command->profileData
            ], function ($value) {
                return $value !== null;
            });

            $updatedAccount = $this->socialAccountService->updateSocialAccount($account, $updateData);

            // Salvar no repositório
            $savedAccount = $this->socialAccountRepository->save($updatedAccount);

            Log::info('Social account updated successfully', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId
            ]);

            return [
                'account' => $savedAccount->toArray(),
                'message' => 'Conta social atualizada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating social account', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateSocialAccountCommand $command): void
    {
        if (empty($command->accountId)) {
            throw new \InvalidArgumentException('ID da conta é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
