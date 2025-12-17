<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Commands\CreateSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Services\SocialAccountValidationService;
use App\Domains\SocialBuffer\Application\Services\SocialAccountCreationOrchestratorService;
use Illuminate\Support\Facades\Log;

/**
 * Use Case para criação de contas sociais
 *
 * Orquestra a criação de uma nova conta social,
 * incluindo validações, persistência e eventos.
 */
class CreateSocialAccountUseCase
{
    private SocialAccountValidationService $validationService;
    private SocialAccountCreationOrchestratorService $orchestratorService;

    public function __construct(
        SocialAccountValidationService $validationService,
        SocialAccountCreationOrchestratorService $orchestratorService
    ) {
        $this->validationService = $validationService;
        $this->orchestratorService = $orchestratorService;
    }

    /**
     * Executa o use case de criação de conta social
     */
    public function execute(CreateSocialAccountCommand $command): array
    {
        try {
            Log::info('Starting social account creation use case', [
                'user_id' => $command->getUserId(),
                'platform' => $command->getPlatform(),
                'username' => $command->getUsername()
            ]);

            // Validar comando
            $validationErrors = $this->validationService->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da conta social inválidos'
                ];
            }

            // Orquestrar criação da conta social
            return $this->orchestratorService->orchestrateSocialAccountCreation($command);
        } catch (\Throwable $exception) {
            Log::error('Error in CreateSocialAccountUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'platform' => $command->getPlatform()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da conta social'],
                'message' => 'Falha ao criar conta social'
            ];
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateSocialAccountUseCase',
            'description' => 'Criação de contas sociais',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
