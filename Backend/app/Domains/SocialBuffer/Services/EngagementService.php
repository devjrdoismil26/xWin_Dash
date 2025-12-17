<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Domain\Analytics; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\AnalyticsRepositoryInterface; // Supondo que o repositório exista
use App\Domains\SocialBuffer\Domain\Interaction; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\InteractionRepositoryInterface; // Supondo que o repositório exista
use Illuminate\Support\Facades\Log;

class EngagementService
{
    protected InteractionRepositoryInterface $interactionRepository;

    protected AnalyticsRepositoryInterface $analyticsRepository;

    public function __construct(InteractionRepositoryInterface $interactionRepository, AnalyticsRepositoryInterface $analyticsRepository)
    {
        $this->interactionRepository = $interactionRepository;
        $this->analyticsRepository = $analyticsRepository;
    }

    /**
     * Registra uma interação para um post.
     *
     * @param int         $postId o ID do post
     * @param string      $type   o tipo de interação (ex: 'like', 'comment', 'share', 'click', 'view')
     * @param int|null    $userId o ID do usuário que realizou a interação (opcional)
     * @param string|null $value  valor adicional da interação (ex: conteúdo do comentário)
     *
     * @return Interaction
     */
    public function recordInteraction(int $postId, string $type, ?int $userId = null, ?string $value = null): Interaction
    {
        Log::info("Registrando interação '{$type}' para o post ID: {$postId}.");

        $interaction = $this->interactionRepository->create([
            'post_id' => $postId,
            'type' => $type,
            'user_id' => $userId,
            'value' => $value,
        ]);

        // Atualizar métricas de analytics (simplificado)
        $this->updateAnalyticsMetrics($postId, $type);

        return $interaction;
    }

    /**
     * Obtém as métricas de engajamento para um post específico.
     *
     * @param int $postId o ID do post
     *
     * @return Analytics|null
     */
    public function getEngagementMetricsForPost(int $postId): ?Analytics
    {
        return $this->analyticsRepository->findByPostId($postId); // Supondo um método para buscar analytics por post ID
    }

    /**
     * Atualiza as métricas de analytics com base em uma interação.
     *
     * @param int    $postId
     * @param string $interactionType
     */
    protected function updateAnalyticsMetrics(int $postId, string $interactionType): void
    {
        $analytics = $this->analyticsRepository->findByPostId($postId);

        if (!$analytics) {
            // Criar um novo registro de analytics se não existir
            $analytics = $this->analyticsRepository->create([
                'post_id' => $postId,
                'platform' => 'unknown', // Plataforma precisa ser determinada
                'views' => 0, 'clicks' => 0, 'likes' => 0, 'comments' => 0, 'shares' => 0,
            ]);
        }

        switch ($interactionType) {
            case 'view':
                $analytics->views++;
                break;
            case 'click':
                $analytics->clicks++;
                break;
            case 'like':
                $analytics->likes++;
                break;
            case 'comment':
                $analytics->comments++;
                break;
            case 'share':
                $analytics->shares++;
                break;
        }

        $this->analyticsRepository->update($analytics->id, $analytics->toArray());
        Log::info("Métricas de analytics atualizadas para o post ID: {$postId} - Tipo: {$interactionType}");
    }
}
