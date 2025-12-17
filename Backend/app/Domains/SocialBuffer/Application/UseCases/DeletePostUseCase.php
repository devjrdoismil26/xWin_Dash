<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Commands\DeletePostCommand;
use App\Domains\SocialBuffer\Application\Handlers\DeletePostHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeletePostUseCase
{
    public function __construct(
        private DeletePostHandler $deletePostHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeletePostCommand $command): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($command->userId, 'socialbuffer', 'delete_post');

            // Validar regras de negócio cross-module
            $this->validationService->validateSocialBufferBusinessRules($command->toArray());

            // Executar comando via handler
            $result = $this->deletePostHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('post.deleted', [
                'post_id' => $command->postId,
                'user_id' => $command->userId
            ]);

            Log::info('Post deleted successfully', [
                'post_id' => $command->postId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Post excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting post', [
                'post_id' => $command->postId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir post: ' . $e->getMessage()
            ];
        }
    }
}
