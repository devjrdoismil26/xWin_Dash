<?php

namespace App\Application\Universe\Services;

use App\Domains\AI\Services\AIService;
use App\Domains\Universe\Models\UniverseTemplate;
use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Models\UniverseAnalytics;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AIPersonalizationService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Personaliza conteúdo usando IA baseado no contexto do usuário.
     *
     * @param User|object $user
     * @param string $contentType
     * @param array<string, mixed> $context
     * @return array<string, mixed>
     */
    public function personalizeContent($user, string $contentType, array $context): array
    {
        Log::info("Personalizando conteúdo {$contentType} para usuário {$user->id}");

        try {
            // Analisar histórico do usuário
            $userProfile = $this->buildUserProfile($user, $context);
            
            // Gerar recomendações personalizadas
            $recommendations = $this->generateRecommendations($user, $contentType, $userProfile);
            
            // Personalizar interface/conteúdo
            $personalizedUI = $this->generatePersonalizedInterface($user, $userProfile);
            
            return [
                'user_id' => $user->id,
                'content_type' => $contentType,
                'user_profile' => $userProfile,
                'recommendations' => $recommendations,
                'personalized_ui' => $personalizedUI,
                'personalized_at' => now()->toISOString(),
                'confidence_score' => $this->calculateConfidenceScore($userProfile, $recommendations)
            ];

        } catch (\Exception $e) {
            Log::error("Erro na personalização de conteúdo: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Constrói perfil do usuário baseado em dados históricos.
     *
     * @param User|object $user
     * @param array<string, mixed> $context
     * @return array<string, mixed>
     */
    private function buildUserProfile($user, array $context): array
    {
        // Buscar instâncias do usuário
        $instances = UniverseInstance::where('user_id', $user->id)->get();
        
        // Buscar templates mais usados
        $templateAnalytics = UniverseAnalytics::where('user_id', $user->id)
            ->where('metric_name', 'template_usage')
            ->get();

        // Analisar preferências baseadas no histórico
        $categories = $instances->pluck('metadata.category')->filter()->countBy();
        $mostUsedFeatures = $context['features'] ?? [];
        
        return [
            'user_id' => $user->id,
            'preferred_categories' => $categories->toArray(),
            'instance_count' => $instances->count(),
            'activity_level' => $this->calculateActivityLevel($instances),
            'feature_preferences' => $mostUsedFeatures,
            'skill_level' => $this->inferSkillLevel($instances, $context),
            'usage_patterns' => $this->analyzeUsagePatterns($instances),
            'last_activity' => $instances->max('updated_at'),
        ];
    }

    /**
     * Gera recomendações personalizadas usando IA.
     *
     * @param User|object $user
     * @param string $contentType
     * @param array<string, mixed> $userProfile
     * @return array<string, mixed>
     */
    private function generateRecommendations($user, string $contentType, array $userProfile): array
    {
        // Buscar templates públicos relevantes
        $publicTemplates = UniverseTemplate::where('is_public', true)
            ->whereIn('category', array_keys($userProfile['preferred_categories']))
            ->orderBy('rating', 'desc')
            ->limit(10)
            ->get();

        // Usar IA para gerar recomendações contextuais
        $prompt = $this->buildRecommendationPrompt($userProfile, $publicTemplates);
        
        try {
            $aiRecommendations = $this->aiService->generateText($prompt, 'gpt-3.5-turbo');
            $parsedRecommendations = $this->parseAIRecommendations($aiRecommendations);
        } catch (\Exception $e) {
            Log::warning("Falha na geração de recomendações por IA: " . $e->getMessage());
            $parsedRecommendations = $this->generateFallbackRecommendations($userProfile, $publicTemplates);
        }

        return [
            'templates' => $parsedRecommendations['templates'] ?? [],
            'features' => $parsedRecommendations['features'] ?? [],
            'learning_resources' => $parsedRecommendations['learning'] ?? [],
            'next_actions' => $parsedRecommendations['actions'] ?? []
        ];
    }

    /**
     * Gera interface personalizada baseada no perfil.
     *
     * @param User|object $user
     * @param array<string, mixed> $userProfile
     * @return array<string, mixed>
     */
    private function generatePersonalizedInterface($user, array $userProfile): array
    {
        return [
            'dashboard_layout' => $this->getOptimalDashboardLayout($userProfile),
            'quick_actions' => $this->getPersonalizedQuickActions($userProfile),
            'sidebar_items' => $this->getPersonalizedSidebar($userProfile),
            'notifications' => $this->getPersonalizedNotifications($user, $userProfile),
            'theme_preferences' => $this->getRecommendedTheme($userProfile)
        ];
    }

    /**
     * Constrói prompt para recomendações de IA.
     */
    private function buildRecommendationPrompt(array $userProfile, $templates): string
    {
        $categoriesText = implode(', ', array_keys($userProfile['preferred_categories']));
        $skillLevel = $userProfile['skill_level'];
        $activityLevel = $userProfile['activity_level'];
        
        return "Baseado no perfil de usuário com preferências por: {$categoriesText}, " .
               "nível de habilidade: {$skillLevel}, nível de atividade: {$activityLevel}, " .
               "recomende 5 templates e 3 features que seriam mais úteis. " .
               "Responda em formato JSON com as chaves: templates, features, learning, actions.";
    }

    /**
     * Faz parsing das recomendações da IA.
     */
    private function parseAIRecommendations(string $aiResponse): array
    {
        $decoded = json_decode($aiResponse, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }
        
        // Fallback parsing if JSON is malformed
        return [
            'templates' => ['AI Chat Assistant', 'Data Analytics Dashboard'],
            'features' => ['AI Processing', 'Analytics', 'Automation'],
            'learning' => ['Getting Started Guide', 'Advanced Techniques'],
            'actions' => ['Create New Instance', 'Explore Templates', 'Join Community']
        ];
    }

    /**
     * Gera recomendações de fallback.
     */
    private function generateFallbackRecommendations(array $userProfile, $templates): array
    {
        return [
            'templates' => $templates->take(5)->pluck('name')->toArray(),
            'features' => ['AI Processing', 'Analytics Dashboard', 'Automation Tools'],
            'learning' => ['Documentation', 'Video Tutorials', 'Community Forum'],
            'actions' => ['Create Instance', 'Explore Gallery', 'Connect Integrations']
        ];
    }

    /**
     * Calcula nível de atividade do usuário.
     */
    private function calculateActivityLevel($instances): string
    {
        $instanceCount = $instances->count();
        $recentActivity = $instances->where('updated_at', '>', now()->subWeek())->count();
        
        if ($instanceCount > 10 && $recentActivity > 3) return 'high';
        if ($instanceCount > 3 && $recentActivity > 0) return 'medium';
        return 'low';
    }

    /**
     * Infere nível de habilidade baseado no uso.
     */
    private function inferSkillLevel($instances, array $context): string
    {
        $advancedFeatures = ['ai_processing', 'advanced_analytics', 'custom_integrations'];
        $usedAdvanced = array_intersect($context['features'] ?? [], $advancedFeatures);
        
        if (count($usedAdvanced) >= 2) return 'advanced';
        if ($instances->count() > 5) return 'intermediate';
        return 'beginner';
    }

    /**
     * Analisa padrões de uso.
     */
    private function analyzeUsagePatterns($instances): array
    {
        return [
            'most_active_hour' => rand(9, 17), // Simplified - would analyze real data
            'preferred_features' => ['ai_processing', 'analytics'],
            'session_duration_avg' => rand(30, 120), // minutes
            'creation_frequency' => 'weekly' // daily, weekly, monthly
        ];
    }

    /**
     * Calcula score de confiança das recomendações.
     */
    private function calculateConfidenceScore(array $userProfile, array $recommendations): float
    {
        $baseScore = 0.5;
        
        // Increase confidence based on data quality
        if ($userProfile['instance_count'] > 5) $baseScore += 0.2;
        if ($userProfile['activity_level'] === 'high') $baseScore += 0.2;
        if (!empty($userProfile['preferred_categories'])) $baseScore += 0.1;
        
        return min(1.0, $baseScore);
    }

    /**
     * Obtém layout otimizado para dashboard.
     */
    private function getOptimalDashboardLayout(array $userProfile): array
    {
        $skillLevel = $userProfile['skill_level'];
        
        return match($skillLevel) {
            'beginner' => [
                'layout' => 'simple',
                'widgets' => ['welcome', 'quick_start', 'templates'],
                'sidebar' => 'collapsed'
            ],
            'intermediate' => [
                'layout' => 'standard',
                'widgets' => ['overview', 'recent', 'analytics', 'templates'],
                'sidebar' => 'expanded'
            ],
            'advanced' => [
                'layout' => 'advanced',
                'widgets' => ['metrics', 'analytics', 'instances', 'agents', 'custom'],
                'sidebar' => 'expanded'
            ],
            default => [
                'layout' => 'standard',
                'widgets' => ['overview', 'recent', 'templates'],
                'sidebar' => 'expanded'
            ]
        };
    }

    /**
     * Obtém ações rápidas personalizadas.
     */
    private function getPersonalizedQuickActions(array $userProfile): array
    {
        $baseActions = ['create_instance', 'browse_templates'];
        
        if ($userProfile['activity_level'] === 'high') {
            $baseActions[] = 'view_analytics';
            $baseActions[] = 'manage_agents';
        }
        
        return $baseActions;
    }

    /**
     * Obtém sidebar personalizada.
     */
    private function getPersonalizedSidebar(array $userProfile): array
    {
        $items = ['dashboard', 'instances', 'templates'];
        
        if ($userProfile['skill_level'] === 'advanced') {
            $items[] = 'agents';
            $items[] = 'analytics';
            $items[] = 'integrations';
        }
        
        return $items;
    }

    /**
     * Obtém notificações personalizadas.
     */
    private function getPersonalizedNotifications($user, array $userProfile): array
    {
        $notifications = [];
        
        if ($userProfile['activity_level'] === 'low') {
            $notifications[] = [
                'type' => 'suggestion',
                'message' => 'Try creating your first Universe instance!',
                'action' => 'create_instance'
            ];
        }
        
        return $notifications;
    }

    /**
     * Obtém tema recomendado.
     */
    private function getRecommendedTheme(array $userProfile): array
    {
        return [
            'theme' => $userProfile['skill_level'] === 'beginner' ? 'light' : 'dark',
            'accent_color' => $userProfile['preferred_categories'] ? 'blue' : 'purple',
            'density' => $userProfile['activity_level'] === 'high' ? 'compact' : 'comfortable'
        ];
    }
}