<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Commands\CreatePostCommand;
use App\Domains\SocialBuffer\Application\Services\PostValidationService;
use App\Domains\SocialBuffer\Application\Services\PostCreationOrchestratorService;
use Illuminate\Support\Facades\Log;

/**
 * Use Case para criação de posts
 *
 * Orquestra a criação de um novo post,
 * incluindo validações, persistência e eventos.
 */
class CreatePostUseCase
{
    private PostValidationService $validationService;
    private PostCreationOrchestratorService $orchestratorService;

    public function __construct(
        PostValidationService $validationService,
        PostCreationOrchestratorService $orchestratorService
    ) {
        $this->validationService = $validationService;
        $this->orchestratorService = $orchestratorService;
    }

    /**
     * Executa o use case de criação de post
     */
    public function execute(CreatePostCommand $command): array
    {
        try {
            Log::info('Starting post creation use case', [
                'user_id' => $command->getUserId(),
                'post_type' => $command->getType(),
                'social_accounts' => $command->getSocialAccountIds()
            ]);

            // Validar comando
            $validationErrors = $this->validationService->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do post inválidos'
                ];
            }

            // Orquestrar criação do post
            return $this->orchestratorService->orchestratePostCreation($command);
        } catch (\Throwable $exception) {
            Log::error('Error in CreatePostUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'post_type' => $command->getType()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do post'],
                'message' => 'Falha ao criar post'
            ];
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreatePostUseCase',
            'description' => 'Criação de posts',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
