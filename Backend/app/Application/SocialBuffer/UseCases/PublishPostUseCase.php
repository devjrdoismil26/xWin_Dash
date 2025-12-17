<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\PublishPostCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class PublishPostUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para publicar um post.
     *
     * @param PublishPostCommand $command
     *
     * @return mixed o post publicado
     */
    public function execute(PublishPostCommand $command)
    {
        return $this->postService->publishPost($command->postId, $command->platforms);
    }
}
