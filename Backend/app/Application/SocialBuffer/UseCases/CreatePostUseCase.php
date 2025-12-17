<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\CreatePostCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class CreatePostUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para criar um novo post.
     *
     * @param CreatePostCommand $command
     *
     * @return mixed o post criado
     */
    public function execute(CreatePostCommand $command)
    {
        return $this->postService->createPost(
            $command->userId,
            $command->content,
            $command->platforms,
            $command->mediaUrls,
            $command->scheduledAt,
        );
    }
}
