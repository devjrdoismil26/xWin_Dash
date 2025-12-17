<?php

namespace App\Domains\SocialBuffer\Jobs;

use App\Domains\SocialBuffer\Domain\Post;
use App\Domains\SocialBuffer\Events\PostPublished;
use App\Domains\SocialBuffer\Factories\PublisherFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable; // Supondo que a entidade de domínio exista
use Illuminate\Queue\InteractsWithQueue; // Supondo que a Factory exista
use Illuminate\Queue\SerializesModels; // Supondo que este evento exista
use Illuminate\Support\Facades\Log;

class ProcessSocialBufferPost implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public Post $post;

    /**
     * Create a new job instance.
     *
     * @param Post $post o post a ser processado
     */
    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info("Processando publicação para o post ID: {$this->post->id}.");

        $results = [];
        foreach ($this->post->socialAccountIds as $socialAccountId) {
            // Em um cenário real, você buscaria a conta social e a plataforma associada
            // Para simplificar, vamos assumir que $socialAccountId já nos dá a plataforma
            $platform = 'facebook'; // Exemplo: determinar a plataforma pelo socialAccountId

            try {
                $publisher = PublisherFactory::create($platform);
                $result = $publisher->publish($this->post);
                $results[$platform] = $result->toArray();

                if ($result->success) {
                    Log::info("Post ID: {$this->post->id} publicado com sucesso na plataforma {$platform}.");
                } else {
                    Log::error("Falha ao publicar post ID: {$this->post->id} na plataforma {$platform}: {$result->message}");
                }
            } catch (\Exception $e) {
                Log::error("Erro ao criar publicador para plataforma {$platform}: " . $e->getMessage());
                $results[$platform] = [
                    'success' => false,
                    'message' => "Publisher creation failed: {$e->getMessage()}",
                    'platform' => $platform,
                ];
            }
        }

        // Atualizar o status do post e disparar evento de publicação
        $this->post->status = 'published'; // Ou 'failed' se todos falharem
        // $this->post->save(); // Persistir a mudança de status

        PostPublished::dispatch($this->post, $results);
        Log::info("Processamento de publicação para post ID: {$this->post->id} concluído.");
    }
}
