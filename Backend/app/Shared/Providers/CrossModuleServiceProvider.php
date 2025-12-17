<?php

namespace App\Shared\Providers;

use Illuminate\Support\ServiceProvider;
use App\Shared\Services\ModuleIntegrationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Services\CrossModuleRelationshipService;
use App\Shared\Services\CrossModuleOrchestrationService;
use App\Shared\Listeners\UserCreatedListener;
use App\Shared\Listeners\LeadCreatedListener;
use App\Shared\Listeners\PostPublishedListener;
use Illuminate\Support\Facades\Event;

/**
 * Cross-Module Service Provider
 * 
 * Provider para registrar e configurar todos os serviços
 * de integração cross-module.
 */
class CrossModuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar serviços de integração cross-module
        $this->app->singleton(ModuleIntegrationService::class, function ($app) {
            return new ModuleIntegrationService();
        });

        $this->app->singleton(CrossModuleValidationService::class, function ($app) {
            return new CrossModuleValidationService();
        });

        $this->app->singleton(CrossModuleEventDispatcher::class, function ($app) {
            return new CrossModuleEventDispatcher(
                $app->make(ModuleIntegrationService::class),
                $app->make(CrossModuleValidationService::class)
            );
        });

        $this->app->singleton(CrossModuleRelationshipService::class, function ($app) {
            return new CrossModuleRelationshipService();
        });

        $this->app->singleton(CrossModuleOrchestrationService::class, function ($app) {
            return new CrossModuleOrchestrationService(
                $app->make(ModuleIntegrationService::class),
                $app->make(CrossModuleValidationService::class),
                $app->make(CrossModuleEventDispatcher::class),
                $app->make(CrossModuleRelationshipService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Registrar listeners de eventos
        $this->registerEventListeners();

        // Configurar middleware de integração
        $this->configureMiddleware();

        // Configurar comandos Artisan
        $this->configureCommands();

        // Configurar rotas de API
        $this->configureRoutes();

        // Configurar views
        $this->configureViews();

        // Configurar traduções
        $this->configureTranslations();

        // Configurar configurações
        $this->configureSettings();
    }

    /**
     * Registrar listeners de eventos
     */
    private function registerEventListeners(): void
    {
        // Registrar listeners para eventos de usuário
        Event::listen(
            \App\Shared\Events\UserCreatedEvent::class,
            UserCreatedListener::class
        );

        // Registrar listeners para eventos de lead
        Event::listen(
            \App\Shared\Events\LeadCreatedEvent::class,
            LeadCreatedListener::class
        );

        // Registrar listeners para eventos de post
        Event::listen(
            \App\Shared\Events\PostPublishedEvent::class,
            PostPublishedListener::class
        );

        // Registrar listeners para eventos de projeto
        Event::listen(
            \App\Shared\Events\ProjectCreatedEvent::class,
            \App\Shared\Listeners\ProjectCreatedListener::class
        );

        // Registrar listeners para eventos de campanha de email
        Event::listen(
            \App\Shared\Events\EmailCampaignCreatedEvent::class,
            \App\Shared\Listeners\EmailCampaignCreatedListener::class
        );
    }

    /**
     * Configurar middleware de integração
     */
    private function configureMiddleware(): void
    {
        // Registrar middleware para validação cross-module
        $this->app['router']->aliasMiddleware(
            'cross.module.validation',
            \App\Shared\Middleware\CrossModuleValidationMiddleware::class
        );

        // Registrar middleware para orquestração cross-module
        $this->app['router']->aliasMiddleware(
            'cross.module.orchestration',
            \App\Shared\Middleware\CrossModuleOrchestrationMiddleware::class
        );

        // Registrar middleware para eventos cross-module
        $this->app['router']->aliasMiddleware(
            'cross.module.events',
            \App\Shared\Middleware\CrossModuleEventMiddleware::class
        );
    }

    /**
     * Configurar comandos Artisan
     */
    private function configureCommands(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Shared\Console\Commands\ProcessCrossModuleEvents::class,
                \App\Shared\Console\Commands\ValidateCrossModuleIntegrity::class,
                \App\Shared\Console\Commands\SyncCrossModuleRelationships::class,
                \App\Shared\Console\Commands\ClearCrossModuleCache::class,
                \App\Shared\Console\Commands\GenerateCrossModuleReport::class,
            ]);
        }
    }

    /**
     * Configurar rotas de API
     */
    private function configureRoutes(): void
    {
        $this->app['router']->group([
            'prefix' => 'api/cross-module',
            'middleware' => ['api', 'auth:sanctum'],
            'namespace' => 'App\\Shared\\Http\\Controllers'
        ], function ($router) {
            // Rotas para integração
            $router->get('/integration/stats', 'CrossModuleIntegrationController@getStats');
            $router->post('/integration/process', 'CrossModuleIntegrationController@processEvent');
            $router->get('/integration/mappings', 'CrossModuleIntegrationController@getMappings');

            // Rotas para validação
            $router->post('/validation/validate', 'CrossModuleValidationController@validate');
            $router->get('/validation/rules', 'CrossModuleValidationController@getRules');
            $router->post('/validation/batch', 'CrossModuleValidationController@validateBatch');

            // Rotas para eventos
            $router->get('/events/stats', 'CrossModuleEventController@getStats');
            $router->post('/events/dispatch', 'CrossModuleEventController@dispatch');
            $router->get('/events/queue', 'CrossModuleEventController@getQueue');
            $router->post('/events/process', 'CrossModuleEventController@processQueue');

            // Rotas para relacionamentos
            $router->get('/relationships/user/{userId}', 'CrossModuleRelationshipController@getUserRelationships');
            $router->get('/relationships/project/{projectId}', 'CrossModuleRelationshipController@getProjectRelationships');
            $router->get('/relationships/lead/{leadId}', 'CrossModuleRelationshipController@getLeadRelationships');
            $router->post('/relationships/create', 'CrossModuleRelationshipController@createRelationship');

            // Rotas para orquestração
            $router->post('/orchestration/user', 'CrossModuleOrchestrationController@orchestrateUserCreation');
            $router->post('/orchestration/project', 'CrossModuleOrchestrationController@orchestrateProjectCreation');
            $router->post('/orchestration/lead', 'CrossModuleOrchestrationController@orchestrateLeadCreation');
            $router->post('/orchestration/post', 'CrossModuleOrchestrationController@orchestratePostPublication');
            $router->post('/orchestration/email-campaign', 'CrossModuleOrchestrationController@orchestrateEmailCampaignSending');
            $router->post('/orchestration/workflow', 'CrossModuleOrchestrationController@orchestrateWorkflowExecution');
            $router->post('/orchestration/batch', 'CrossModuleOrchestrationController@orchestrateBatchOperations');
        });
    }

    /**
     * Configurar views
     */
    private function configureViews(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'cross-module');
    }

    /**
     * Configurar traduções
     */
    private function configureTranslations(): void
    {
        $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'cross-module');
    }

    /**
     * Configurar configurações
     */
    private function configureSettings(): void
    {
        // Configurar cache de validações
        config([
            'cross-module.validation.cache_timeout' => 300, // 5 minutos
            'cross-module.validation.max_retries' => 3,
            'cross-module.validation.retry_delay' => 5,
        ]);

        // Configurar eventos
        config([
            'cross-module.events.max_retries' => 3,
            'cross-module.events.retry_delay' => 5,
            'cross-module.events.queue_timeout' => 3600, // 1 hora
        ]);

        // Configurar orquestração
        config([
            'cross-module.orchestration.transaction_timeout' => 30, // 30 segundos
            'cross-module.orchestration.max_batch_size' => 100,
            'cross-module.orchestration.parallel_processing' => true,
        ]);

        // Configurar relacionamentos
        config([
            'cross-module.relationships.cache_timeout' => 600, // 10 minutos
            'cross-module.relationships.max_depth' => 5,
            'cross-module.relationships.include_inactive' => false,
        ]);

        // Configurar integração
        config([
            'cross-module.integration.auto_process' => true,
            'cross-module.integration.process_delay' => 0, // imediato
            'cross-module.integration.max_concurrent' => 10,
        ]);
    }

    /**
     * Obter serviços fornecidos
     */
    public function provides(): array
    {
        return [
            ModuleIntegrationService::class,
            CrossModuleValidationService::class,
            CrossModuleEventDispatcher::class,
            CrossModuleRelationshipService::class,
            CrossModuleOrchestrationService::class,
        ];
    }
}