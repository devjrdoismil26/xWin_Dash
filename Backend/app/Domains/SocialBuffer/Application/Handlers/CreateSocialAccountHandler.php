<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\CreateSocialAccountCommand;
use App\Domains\SocialBuffer\Domain\Repositories\SocialAccountRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\SocialAccountService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class CreateSocialAccountHandler
{
    public function __construct(
        private SocialAccountRepositoryInterface $socialAccountRepository,
        private SocialAccountService $socialAccountService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(CreateSocialAccountCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se a conta já existe
            $existingAccount = $this->socialAccountRepository->findByPlatformAndUsername(
                $command->platform,
                $command->username
            );

            if ($existingAccount) {
                throw new \Exception('Conta social já existe para este usuário e plataforma');
            }

            // Validar credenciais com a plataforma
            $validationResult = $this->socialMediaService->validateAccountCredentials(
                $command->platform,
                $command->accessToken,
                $command->refreshToken
            );

            if (!$validationResult['valid']) {
                throw new \Exception('Credenciais inválidas: ' . $validationResult['message']);
            }

            // Criar a conta social no domínio
            $socialAccount = $this->socialAccountService->createSocialAccount([
                'user_id' => $command->userId,
                'platform' => $command->platform,
                'username' => $command->username,
                'access_token' => $command->accessToken,
                'refresh_token' => $command->refreshToken,
                'token_expires_at' => $command->tokenExpiresAt,
                'is_active' => true,
                'profile_data' => $validationResult['profile_data'] ?? null
            ]);

            // Salvar no repositório
            $savedAccount = $this->socialAccountRepository->save($socialAccount);

            Log::info('Social account created successfully', [
                'account_id' => $savedAccount->id,
                'user_id' => $command->userId,
                'platform' => $command->platform
            ]);

            return [
                'account' => $savedAccount->toArray(),
                'message' => 'Conta social criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating social account', [
                'user_id' => $command->userId,
                'platform' => $command->platform,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateSocialAccountCommand $command): void
    {
        if (empty($command->platform)) {
            throw new \InvalidArgumentException('Plataforma é obrigatória');
        }

        if (empty($command->username)) {
            throw new \InvalidArgumentException('Nome de usuário é obrigatório');
        }

        if (empty($command->accessToken)) {
            throw new \InvalidArgumentException('Token de acesso é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
