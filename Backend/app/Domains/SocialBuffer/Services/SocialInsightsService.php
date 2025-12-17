<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Domain\Analytics;
use App\Domains\SocialBuffer\Domain\AnalyticsRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Post;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class SocialInsightsService
{
    protected AnalyticsRepositoryInterface $analyticsRepository;

    public function __construct(AnalyticsRepositoryInterface $analyticsRepository)
    {
        $this->analyticsRepository = $analyticsRepository;
    }

    /**
     * Obtém um resumo das métricas de performance para um post específico.
     * Otimização: Cache de 5 minutos
     *
     * @param int $postId o ID do post
     *
     * @return Analytics|null
     */
    public function getPostPerformanceSummary(int $postId): ?Analytics
    {
        $cacheKey = "social_post_insights_{$postId}";
        
        return Cache::remember($cacheKey, 300, function () use ($postId) {
            Log::info("Obtendo resumo de performance para o post ID: {$postId}.");
            return $this->analyticsRepository->findByPostId($postId);
        });
    }

    /**
     * Calcula a taxa de engajamento para um post.
     * Otimização: Cache de 5 minutos
     *
     * @param int $postId o ID do post
     *
     * @return float a taxa de engajamento (ex: (likes + comments + shares) / views)
     */
    public function calculateEngagementRate(int $postId): float
    {
        $cacheKey = "social_post_engagement_rate_{$postId}";
        
        return Cache::remember($cacheKey, 300, function () use ($postId) {
            $analytics = $this->analyticsRepository->findByPostId($postId);

            if (!$analytics || $analytics->views === 0) {
                return 0.0;
            }

            $engagement = $analytics->likes + $analytics->comments + $analytics->shares;
            return round(($engagement / $analytics->views) * 100, 2);
        });
    }

    /**
     * Identifica os posts com melhor performance em um período.
     *
     * @param int       $userId    o ID do usuário
     * @param \DateTime $startDate data de início
     * @param \DateTime $endDate   data de fim
     * @param string    $metric    métrica para ordenar (ex: 'views', 'clicks', 'likes')
     * @param int       $limit     limite de resultados
     *
     * @return array<Post> posts com melhor performance
     */
    public function getTopPerformingPosts(int $userId, \DateTime $startDate, \DateTime $endDate, string $metric = 'views', int $limit = 5): array
    {
        Log::info("Buscando posts com melhor performance para o usuário ID: {$userId} entre {$startDate->format('Y-m-d')} e {$endDate->format('Y-m-d')}.");

        // Em um cenário real, isso envolveria queries complexas no repositório de analytics
        // Simulação de retorno de posts
        return [
            // new Post(...),
            // new Post(...),
        ];
    }
}
