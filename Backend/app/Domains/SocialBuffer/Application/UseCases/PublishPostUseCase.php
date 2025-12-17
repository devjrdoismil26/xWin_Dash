<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Domain\Post;
use App\Domains\SocialBuffer\Application\Commands\PublishPostCommand;
use App\Domains\SocialBuffer\Application\Handlers\PublishPostHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\PostPublishedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para publicação de posts
 *
 * Orquestra a publicação de um post,
 * incluindo validações, processamento e eventos.
 */
class PublishPostUseCase
{
    private PublishPostHandler $handler;
    private SocialBufferApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        PublishPostHandler $handler,
        SocialBufferApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de publicação de post
     */
    public function execute(PublishPostCommand $command): array
    {
        try {
            Log::info('Starting post publishing use case', [
                'post_id' => $command->getPostId(),
                'user_id' => $command->getUserId()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da publicação inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Buscar post
                $post = $this->applicationService->getPostById($command->getPostId());
                if (!$post) {
                    return [
                        'success' => false,
                        'errors' => ['Post não encontrado'],
                        'message' => 'Post não encontrado'
                    ];
                }

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validatePostPublishing($post, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar publicação
                $result = $this->handler->handle($command);

                // Executar ações pós-publicação
                $this->executePostPublishingActions($post, $command, $result);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($post, $command, $result);

                Log::info('Post published successfully', [
                    'post_id' => $post->getId(),
                    'user_id' => $command->getUserId(),
                    'published_accounts' => $result['published_accounts'] ?? []
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'post_id' => $post->getId(),
                        'published_accounts' => $result['published_accounts'] ?? [],
                        'failed_accounts' => $result['failed_accounts'] ?? [],
                        'published_at' => now()->toISOString(),
                        'status' => 'published'
                    ],
                    'message' => 'Post publicado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in PublishPostUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'post_id' => $command->getPostId(),
                'user_id' => $command->getUserId()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante publicação do post'],
                'message' => 'Falha ao publicar post'
            ];
        }
    }

    /**
     * Valida o comando de publicação
     */
    private function validateCommand(PublishPostCommand $command): array
    {
        $errors = [];

        if ($command->getPostId() <= 0) {
            $errors[] = 'ID do post é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(Post $post, int $userId): array
    {
        try {
            // Verificar se o post pertence ao usuário
            if ($post->getUserId() !== $userId) {
                return ['Post não pertence ao usuário'];
            }

            // Verificar se o post pode ser publicado
            if (!$post->canBePublished()) {
                return ['Post não pode ser publicado no status atual'];
            }

            // Validar contas sociais
            $accountErrors = $this->validateSocialAccounts($post);
            if (!empty($accountErrors)) {
                return $accountErrors;
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar agendamento
            $scheduleErrors = $this->validateScheduling($post);
            if (!empty($scheduleErrors)) {
                return $scheduleErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for post publishing', [
                'error' => $exception->getMessage(),
                'post_id' => $post->getId(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida contas sociais
     */
    private function validateSocialAccounts(Post $post): array
    {
        $errors = [];

        foreach ($post->getSocialAccountIds() as $accountId) {
            $socialAccount = $this->applicationService->getSocialAccountById($accountId);

            if (!$socialAccount) {
                $errors[] = "Conta social ID {$accountId} não encontrada";
                continue;
            }

            if (!$socialAccount->isActive()) {
                $errors[] = "Conta social ID {$accountId} não está ativa";
                continue;
            }

            if (!$socialAccount->hasValidCredentials()) {
                $errors[] = "Conta social ID {$accountId} não possui credenciais válidas";
                continue;
            }

            // Verificar se a conta suporta o tipo de post
            if (!$socialAccount->supportsPostType($post->getType())) {
                $errors[] = "Conta social ID {$accountId} não suporta o tipo de post '{$post->getType()}'";
            }
        }

        return $errors;
    }

    /**
     * Valida limites do usuário
     */
    private function validateUserLimits(int $userId): array
    {
        $errors = [];

        // Verificar limite de posts diários
        $dailyPostsCount = $this->applicationService->getDailyPostsCount($userId);
        $maxDailyPosts = $this->applicationService->getUserMaxDailyPosts($userId);

        if ($dailyPostsCount >= $maxDailyPosts) {
            $errors[] = "Usuário excedeu o limite de posts diários ({$maxDailyPosts})";
        }

        // Verificar limite de posts por hora
        $hourlyPostsCount = $this->applicationService->getHourlyPostsCount($userId);
        $maxHourlyPosts = $this->applicationService->getUserMaxHourlyPosts($userId);

        if ($hourlyPostsCount >= $maxHourlyPosts) {
            $errors[] = "Usuário excedeu o limite de posts por hora ({$maxHourlyPosts})";
        }

        return $errors;
    }

    /**
     * Valida agendamento
     */
    private function validateScheduling(Post $post): array
    {
        $errors = [];

        // Verificar se o post está agendado para o futuro
        if ($post->getScheduledAt() && $post->getScheduledAt() > new \DateTime()) {
            $errors[] = 'Post ainda não está no horário de publicação agendado';
        }

        return $errors;
    }

    /**
     * Executa ações pós-publicação
     */
    private function executePostPublishingActions(Post $post, PublishPostCommand $command, array $result): void
    {
        try {
            // Atualizar status do post
            $post->markAsPublished();
            $this->applicationService->updatePostStatus($post->getId(), 'published');

            // Configurar analytics pós-publicação
            $this->applicationService->setupPostPublishingAnalytics($post, $result);

            // Configurar monitoramento de engajamento
            $this->applicationService->setupEngagementMonitoring($post);

            // Configurar notificações pós-publicação
            $this->applicationService->setupPostPublishingNotifications($post, $result);

            // Configurar integrações pós-publicação
            $this->applicationService->setupPostPublishingIntegrations($post, $result);

            // Atualizar estatísticas
            $this->applicationService->updatePublishingStats($post, $result);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-publishing actions', [
                'error' => $exception->getMessage(),
                'post_id' => $post->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(Post $post, PublishPostCommand $command, array $result): void
    {
        try {
            $event = new PostPublishedEvent(
                postId: $post->getId(),
                postContent: $post->getContent(),
                userId: $command->getUserId(),
                projectId: $post->getProjectId(),
                postType: $post->getType(),
                socialAccounts: $post->getSocialAccountIds(),
                metadata: [
                    'published_accounts' => $result['published_accounts'] ?? [],
                    'failed_accounts' => $result['failed_accounts'] ?? [],
                    'priority' => $post->getPriority(),
                    'source' => 'use_case',
                    'published_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching post published event', [
                'error' => $exception->getMessage(),
                'post_id' => $post->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'PublishPostUseCase',
            'description' => 'Publicação de posts',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
