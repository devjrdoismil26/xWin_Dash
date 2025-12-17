<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\PublishPostCommand; // Reutilizando o command
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class PublishScheduledPostUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para publicar um post agendado.
     *
     * @param int $postId o ID do post a ser publicado
     *
     * @return mixed o post publicado
     */
    public function execute(int $postId)
    {
        // Busca o post e suas plataformas associadas
        $post = $this->postService->findPostById($postId);

        if (!$post) {
            // Lidar com o caso de post não encontrado
            return null;
        }

        // Cria um comando de publicação e delega para o PublishPostUseCase
        $command = new PublishPostCommand($post->id, $post->platforms); // Assumindo que o post tem uma propriedade 'platforms'
        return $this->postService->publishPost($command->postId, $command->platforms);
    }
}
