<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\SocialBuffer\Models\Post;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class AnonymizePostsActivity extends Activity
{
    /**
     * Anonimiza os posts de um usuário.
     *
     * @param string $userId o ID do usuário cujos posts serão anonimizados
     */
    public function execute(string $userId): void
    {
        // LÓGICA DE EXEMPLO:
        // Encontrar todos os posts do usuário e atualizar o campo de autor para 'Anônimo'
        // ou desassociar do usuário.
        $posts = Post::where('user_id', $userId)->get();

        foreach ($posts as $post) {
            try {
                $post->update([
                    'user_id' => null, // Desassocia o post do usuário
                    'author_name' => 'Anônimo', // Define um nome de autor genérico
                ]);
                LoggerFacade::info("Post {$post->id} anonimizado para o usuário {$userId}.");
            } catch (\Exception $e) {
                LoggerFacade::error("Falha ao anonimizar post {$post
                    ->id} para o usuário {$userId}: " . $e->getMessage());
            }
        }
    }

    /**
     * A compensação para anonimização de posts é complexa e geralmente não é implementada.
     * Reverter a anonimização exigiria armazenar o ID do usuário original, o que pode
     * violar políticas de privacidade.
     */
    public function compensate(string $userId): void
    {
        LoggerFacade::warning("Compensação para AnonymizePostsActivity não implementada para usuário {$userId}.");
    }
}
