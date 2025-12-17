<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\UpdatePostStatusCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class UpdatePostStatusUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para atualizar o status de um post.
     *
     * @param UpdatePostStatusCommand $command
     *
     * @return mixed o post atualizado
     */
    public function execute(UpdatePostStatusCommand $command)
    {
        return $this->postService->updatePostStatus($command->postId, $command->newStatus);
    }
}
