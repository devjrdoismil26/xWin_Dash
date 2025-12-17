<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Domain\SocialAccount;
use App\Domains\SocialBuffer\Application\Commands\CreateSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Handlers\CreateSocialAccountHandler;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\SocialAccountCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SocialAccountCreationOrchestratorService
{
    private CreateSocialAccountHandler $handler;
    private SocialBufferApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;
    private SocialAccountValidationService $validationService;

    public function __construct(
        CreateSocialAccountHandler $handler,
        SocialBufferApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher,
        SocialAccountValidationService $validationService
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
        $this->validationService = $validationService;
    }

    /**
     * Orquestra a criação de uma conta social.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    public function orchestrateSocialAccountCreation(CreateSocialAccountCommand $command): array
    {
        try {
            Log::info('Starting social account creation orchestration', [
                'user_id' => $command->getUserId(),
                'platform' => $command->getPlatform(),
                'username' => $command->getUsername()
            ]);

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $socialAccount = $this->createSocialAccountEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateSocialAccountCreation($socialAccount, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir conta social
                $savedSocialAccount = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedSocialAccount, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedSocialAccount, $command);

                Log::info('Social account created successfully', [
                    'account_id' => $savedSocialAccount->getId(),
                    'user_id' => $command->getUserId(),
                    'platform' => $savedSocialAccount->getPlatform(),
                    'username' => $savedSocialAccount->getUsername()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'social_account' => $savedSocialAccount->toArray(),
                        'account_id' => $savedSocialAccount->getId()
                    ],
                    'message' => 'Conta social criada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountCreationOrchestratorService', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'platform' => $command->getPlatform()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da conta social'],
                'message' => 'Falha ao criar conta social'
            ];
        }
    }

    /**
     * Cria entidade de domínio.
     *
     * @param CreateSocialAccountCommand $command
     * @return SocialAccount
     */
    protected function createSocialAccountEntity(CreateSocialAccountCommand $command): SocialAccount
    {
        return new SocialAccount(
            platform: $command->getPlatform(),
            userId: $command->getUserId(),
            username: $command->getUsername(),
            displayName: $command->getDisplayName(),
            accessToken: $command->getAccessToken(),
            refreshToken: $command->getRefreshToken(),
            expiresAt: $command->getExpiresAt(),
            status: $command->getStatus() ?? 'active',
            profilePicture: $command->getProfilePicture(),
            bio: $command->getBio(),
            followersCount: $command->getFollowersCount(),
            followingCount: $command->getFollowingCount(),
            postsCount: $command->getPostsCount(),
            isVerified: $command->getIsVerified(),
            metadata: $command->getMetadata(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Executa ações pós-criação.
     *
     * @param SocialAccount $socialAccount
     * @param CreateSocialAccountCommand $command
     * @return void
     */
    protected function executePostCreationActions(SocialAccount $socialAccount, CreateSocialAccountCommand $command): void
    {
        try {
            // Configurar conta inicial
            $this->applicationService->configureInitialSocialAccountSettings($socialAccount);

            // Sincronizar dados do perfil
            $this->applicationService->syncSocialAccountProfile($socialAccount);

            // Configurar analytics
            $this->applicationService->setupSocialAccountAnalytics($socialAccount);

            // Configurar notificações
            $this->applicationService->setupSocialAccountNotifications($socialAccount);

            // Configurar integrações
            $this->applicationService->setupSocialAccountIntegrations($socialAccount);

            // Configurar webhooks
            $this->applicationService->setupSocialAccountWebhooks($socialAccount);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for social account', [
                'error' => $exception->getMessage(),
                'account_id' => $socialAccount->id
            ]);
        }
    }

    /**
     * Dispara evento de domínio.
     *
     * @param SocialAccount $socialAccount
     * @param CreateSocialAccountCommand $command
     * @return void
     */
    protected function dispatchDomainEvent(SocialAccount $socialAccount, CreateSocialAccountCommand $command): void
    {
        try {
            $event = new SocialAccountCreatedEvent(
                accountId: $socialAccount->id,
                platform: $socialAccount->platform,
                username: $socialAccount->username,
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                metadata: [
                    'display_name' => $socialAccount->displayName,
                    'status' => $socialAccount->status,
                    'is_verified' => $socialAccount->isVerified,
                    'followers_count' => $socialAccount->followersCount,
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching social account created event', [
                'error' => $exception->getMessage(),
                'account_id' => $socialAccount->id
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
            'service' => 'SocialAccountCreationOrchestratorService',
            'description' => 'Orquestração da criação de contas sociais',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
