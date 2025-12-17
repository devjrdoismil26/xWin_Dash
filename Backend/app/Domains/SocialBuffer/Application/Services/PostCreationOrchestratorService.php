<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Domain\Post;
use App\Domains\SocialBuffer\Application\Commands\CreatePostCommand;
use App\Domains\SocialBuffer\Application\Handlers\CreatePostHandler;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\PostCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PostCreationOrchestratorService
{
    private CreatePostHandler $handler;
    private SocialBufferApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;
    private PostValidationService $postValidationService;

    public function __construct(
        CreatePostHandler $handler,
        SocialBufferApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher,
        PostValidationService $postValidationService
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
        $this->postValidationService = $postValidationService;
    }

    /**
     * Orquestra a criação de um post.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    public function orchestratePostCreation(CreatePostCommand $command): array
    {
        try {
            Log::info('Starting post creation orchestration', [
                'user_id' => $command->getUserId(),
                'post_type' => $command->getType(),
                'social_accounts' => $command->getSocialAccountIds()
            ]);

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $post = $this->createPostEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validatePostCreation($post, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir post
                $savedPost = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedPost, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedPost, $command);

                Log::info('Post created successfully', [
                    'post_id' => $savedPost->getId(),
                    'user_id' => $command->getUserId(),
                    'post_type' => $savedPost->getType()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'post' => $savedPost->toArray(),
                        'post_id' => $savedPost->getId()
                    ],
                    'message' => 'Post criado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in PostCreationOrchestratorService', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'post_type' => $command->getType()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do post'],
                'message' => 'Falha ao criar post'
            ];
        }
    }

    /**
     * Cria entidade de domínio.
     *
     * @param CreatePostCommand $command
     * @return Post
     */
    protected function createPostEntity(CreatePostCommand $command): Post
    {
        return new Post(
            content: $command->getContent(),
            userId: $command->getUserId(),
            socialAccountIds: $command->getSocialAccountIds(),
            type: $command->getType(),
            status: $command->getStatus() ?? 'draft',
            priority: $command->getPriority(),
            title: $command->getTitle(),
            description: $command->getDescription(),
            linkUrl: $command->getLinkUrl(),
            linkTitle: $command->getLinkTitle(),
            linkDescription: $command->getLinkDescription(),
            linkImage: $command->getLinkImage(),
            scheduledAt: $command->getScheduledAt(),
            mentions: $command->getMentions(),
            location: $command->getLocation(),
            metadata: $command->getMetadata(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Executa ações pós-criação.
     *
     * @param Post $post
     * @param CreatePostCommand $command
     * @return void
     */
    protected function executePostCreationActions(Post $post, CreatePostCommand $command): void
    {
        try {
            // Configurar post inicial
            $this->applicationService->configureInitialPostSettings($post);

            // Configurar agendamento se necessário
            if ($post->scheduledAt) {
                $this->applicationService->setupPostScheduling($post);
            }

            // Configurar analytics
            $this->applicationService->setupPostAnalytics($post);

            // Configurar notificações
            $this->applicationService->setupPostNotifications($post);

            // Configurar integrações
            $this->applicationService->setupPostIntegrations($post);

            // Configurar hashtags
            $this->applicationService->extractAndSetupHashtags($post);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for post', [
                'error' => $exception->getMessage(),
                'post_id' => $post->id
            ]);
        }
    }

    /**
     * Dispara evento de domínio.
     *
     * @param Post $post
     * @param CreatePostCommand $command
     * @return void
     */
    protected function dispatchDomainEvent(Post $post, CreatePostCommand $command): void
    {
        try {
            $event = new PostCreatedEvent(
                postId: $post->id,
                postContent: $post->content,
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                postType: $post->type->getValue(),
                socialAccounts: $post->socialAccountIds,
                metadata: [
                    'priority' => $post->priority->getValue(),
                    'status' => $post->status->getValue(),
                    'scheduled_at' => $post->scheduledAt?->format('Y-m-d H:i:s'),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching post created event', [
                'error' => $exception->getMessage(),
                'post_id' => $post->id
            ]);
        }
    }

    /**
     * Obtém estatísticas do serviço.
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'service' => 'PostCreationOrchestratorService',
            'description' => 'Orquestração da criação de posts',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
