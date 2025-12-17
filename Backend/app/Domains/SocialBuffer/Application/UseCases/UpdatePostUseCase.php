<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Commands\UpdatePostCommand;
use App\Domains\SocialBuffer\Application\Handlers\UpdatePostHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdatePostUseCase
{
    public function __construct(
        private UpdatePostHandler $updatePostHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdatePostCommand $command): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($command->userId, 'socialbuffer', 'update_post');

            // Validar regras de negócio cross-module
            $this->validationService->validateSocialBufferBusinessRules($command->toArray());

            // Executar comando via handler
            $result = $this->updatePostHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('post.updated', [
                'post_id' => $command->postId,
                'user_id' => $command->userId,
                'changes' => $command->toArray()
            ]);

            Log::info('Post updated successfully', [
                'post_id' => $command->postId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Post atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating post', [
                'post_id' => $command->postId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar post: ' . $e->getMessage()
            ];
        }
    }
}
