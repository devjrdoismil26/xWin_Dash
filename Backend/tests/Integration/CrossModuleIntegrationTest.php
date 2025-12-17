<?php

namespace Tests\Integration;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Shared\Services\ModuleIntegrationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Services\CrossModuleRelationshipService;
use App\Shared\Services\CrossModuleOrchestrationService;
use App\Shared\Events\UserCreatedEvent;
use App\Shared\Events\ProjectCreatedEvent;
use App\Shared\Events\LeadCreatedEvent;
use App\Shared\Events\EmailCampaignCreatedEvent;
use App\Shared\Events\PostPublishedEvent;
use App\Domains\Users\Domain\User;
use App\Domains\Projects\Domain\Project;
use App\Domains\Leads\Domain\Lead;
use App\Domains\EmailMarketing\Domain\EmailList;
use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\SocialBuffer\Domain\Post;
use App\Domains\SocialBuffer\Domain\SocialAccount;
use App\Domains\Universe\Domain\UniverseInstance;
use App\Domains\Workflows\Domain\Workflow;
use App\Domains\Media\Domain\Media;
use App\Domains\Media\Domain\Folder;
use App\Domains\Analytics\Domain\AnalyticsMetric;
use App\Domains\Aura\Domain\AuraChat;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Domains\AI\Domain\AIGeneration;
use App\Domains\Categorization\Domain\Category;
use App\Domains\Integrations\Domain\Integration;
use App\Domains\NodeRed\Domain\NodeRedFlow;
use App\Domains\Products\Domain\Product;
use App\Domains\Activity\Domain\Activity;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Cache;

/**
 * Cross-Module Integration Tests
 * 
 * Testes de integração para verificar o funcionamento
 * correto da integração entre módulos.
 */
class CrossModuleIntegrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private ModuleIntegrationService $moduleIntegrationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;
    private CrossModuleRelationshipService $relationshipService;
    private CrossModuleOrchestrationService $orchestrationService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->moduleIntegrationService = app(ModuleIntegrationService::class);
        $this->validationService = app(CrossModuleValidationService::class);
        $this->eventDispatcher = app(CrossModuleEventDispatcher::class);
        $this->relationshipService = app(CrossModuleRelationshipService::class);
        $this->orchestrationService = app(CrossModuleOrchestrationService::class);
    }

    /**
     * Testa integração de criação de usuário
     */
    public function testUserCreationIntegration(): void
    {
        // Criar usuário
        $user = new User(
            'João Silva',
            'joao@example.com',
            'password123',
            'active'
        );

        // Orquestrar criação de usuário
        $results = $this->orchestrationService->orchestrateUserCreation($user);

        // Verificar resultados
        $this->assertArrayHasKey('user', $results);
        $this->assertArrayHasKey('lead', $results);
        $this->assertArrayHasKey('email_list', $results);
        $this->assertArrayHasKey('project', $results);
        $this->assertArrayHasKey('universe_instance', $results);
        $this->assertArrayHasKey('aura_chat', $results);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }

    /**
     * Testa integração de criação de projeto
     */
    public function testProjectCreationIntegration(): void
    {
        // Criar usuário
        $user = new User(
            'Maria Santos',
            'maria@example.com',
            'password123',
            'active'
        );

        // Criar projeto
        $project = new Project(
            'Projeto Teste',
            $user->getId(),
            'Projeto de teste para integração',
            'active',
            'high',
            'web_development'
        );

        // Orquestrar criação de projeto
        $results = $this->orchestrationService->orchestrateProjectCreation($project, $user);

        // Verificar resultados
        $this->assertArrayHasKey('project', $results);
        $this->assertArrayHasKey('tasks', $results);
        $this->assertArrayHasKey('media_folder', $results);
        $this->assertArrayHasKey('workflow', $results);
        $this->assertArrayHasKey('analytics_metrics', $results);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }

    /**
     * Testa integração de criação de lead
     */
    public function testLeadCreationIntegration(): void
    {
        // Criar usuário
        $user = new User(
            'Pedro Costa',
            'pedro@example.com',
            'password123',
            'active'
        );

        // Criar lead
        $lead = new Lead(
            'Lead Teste',
            'lead@example.com',
            $user->getId(),
            'active',
            'qualified',
            'website'
        );

        // Orquestrar criação de lead
        $results = $this->orchestrationService->orchestrateLeadCreation($lead, $user);

        // Verificar resultados
        $this->assertArrayHasKey('lead', $results);
        $this->assertArrayHasKey('email_list_subscription', $results);
        $this->assertArrayHasKey('workflow_trigger', $results);
        $this->assertArrayHasKey('aura_chat', $results);
        $this->assertArrayHasKey('analytics_metrics', $results);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }

    /**
     * Testa integração de publicação de post
     */
    public function testPostPublicationIntegration(): void
    {
        // Criar usuário
        $user = new User(
            'Ana Oliveira',
            'ana@example.com',
            'password123',
            'active'
        );

        // Criar conta social
        $socialAccount = new SocialAccount(
            'Conta Instagram',
            'instagram',
            $user->getId(),
            'active',
            'instagram_account_id'
        );

        // Criar post
        $post = new Post(
            'Conteúdo do post de teste',
            $user->getId(),
            'active',
            'text',
            'medium'
        );

        // Orquestrar publicação de post
        $results = $this->orchestrationService->orchestratePostPublication($post, $socialAccount, $user);

        // Verificar resultados
        $this->assertArrayHasKey('post', $results);
        $this->assertArrayHasKey('analytics_metrics', $results);
        $this->assertArrayHasKey('lead_creation', $results);
        $this->assertArrayHasKey('email_campaign', $results);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }

    /**
     * Testa integração de envio de campanha de email
     */
    public function testEmailCampaignSendingIntegration(): void
    {
        // Criar usuário
        $user = new User(
            'Carlos Lima',
            'carlos@example.com',
            'password123',
            'active'
        );

        // Criar lista de email
        $emailList = new EmailList(
            'Lista de Teste',
            $user->getId(),
            'Lista de email para testes',
            'active',
            'static'
        );

        // Criar campanha de email
        $emailCampaign = new EmailCampaign(
            'Campanha Teste',
            $user->getId(),
            'Campanha de email para testes',
            'active',
            'newsletter'
        );

        // Orquestrar envio de campanha
        $results = $this->orchestrationService->orchestrateEmailCampaignSending($emailCampaign, $emailList, $user);

        // Verificar resultados
        $this->assertArrayHasKey('campaign', $results);
        $this->assertArrayHasKey('analytics_metrics', $results);
        $this->assertArrayHasKey('workflow_trigger', $results);
        $this->assertArrayHasKey('lead_creation', $results);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }

    /**
     * Testa integração de execução de workflow
     */
    public function testWorkflowExecutionIntegration(): void
    {
        // Criar usuário
        $user = new User(
            'Fernanda Rocha',
            'fernanda@example.com',
            'password123',
            'active'
        );

        // Criar workflow
        $workflow = new Workflow(
            'Workflow Teste',
            $user->getId(),
            'Workflow para testes de integração',
            'active',
            'automation',
            'medium'
        );

        // Contexto de execução
        $context = [
            'userId' => $user->getId(),
            'trigger' => 'manual'
        ];

        // Orquestrar execução de workflow
        $results = $this->orchestrationService->orchestrateWorkflowExecution($workflow, $context);

        // Verificar resultados
        $this->assertArrayHasKey('workflow', $results);
        $this->assertArrayHasKey('analytics_metrics', $results);
        $this->assertArrayHasKey('activities', $results);
        $this->assertArrayHasKey('notifications', $results);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }

    /**
     * Testa validações cross-module
     */
    public function testCrossModuleValidations(): void
    {
        // Criar usuário
        $user = new User(
            'Roberto Silva',
            'roberto@example.com',
            'password123',
            'active'
        );

        // Criar projeto
        $project = new Project(
            'Projeto Validação',
            $user->getId(),
            'Projeto para testes de validação',
            'active',
            'high',
            'web_development'
        );

        // Testar validação de associação usuário-projeto
        $errors = $this->validationService->validateUserProjectAssociation($user, $project);
        $this->assertIsArray($errors);
        $this->assertEmpty($errors);

        // Testar validação com usuário inativo
        $inactiveUser = new User(
            'Usuário Inativo',
            'inativo@example.com',
            'password123',
            'inactive'
        );

        $errors = $this->validationService->validateUserProjectAssociation($inactiveUser, $project);
        $this->assertIsArray($errors);
        $this->assertNotEmpty($errors);
        $this->assertContains('Usuário deve estar ativo para ser associado a projetos', $errors);
    }

    /**
     * Testa dispatcher de eventos
     */
    public function testEventDispatcher(): void
    {
        // Criar evento
        $event = new UserCreatedEvent(
            1,
            'Usuário Teste',
            'usuario@example.com',
            null,
            ['test' => true]
        );

        // Disparar evento
        $this->eventDispatcher->dispatch($event);

        // Verificar que o evento foi processado
        // Event was dispatched without errors
        Event::assertDispatched(\App\Domains\Users\Events\UserCreated::class, function ($event) {
            return $event->user !== null && $event->user->email !== null;
        });
        
        // Verify event was processed successfully
        $this->assertTrue(Event::hasDispatched(\App\Domains\Users\Events\UserCreated::class));
    }

    /**
     * Testa serviço de relacionamentos
     */
    public function testRelationshipService(): void
    {
        // Criar usuário
        $user = new User(
            'Usuário Relacionamento',
            'relacionamento@example.com',
            'password123',
            'active'
        );

        // Obter entidades relacionadas
        $relatedEntities = $this->relationshipService->getUserRelatedEntities($user->getId());

        // Verificar estrutura de resposta
        $this->assertIsArray($relatedEntities);
        $this->assertArrayHasKey('user', $relatedEntities);
        $this->assertArrayHasKey('projects', $relatedEntities);
        $this->assertArrayHasKey('leads', $relatedEntities);
        $this->assertArrayHasKey('email_lists', $relatedEntities);
        $this->assertArrayHasKey('social_accounts', $relatedEntities);
        $this->assertArrayHasKey('universe_instances', $relatedEntities);
        $this->assertArrayHasKey('workflows', $relatedEntities);
        $this->assertArrayHasKey('media', $relatedEntities);
        $this->assertArrayHasKey('analytics_metrics', $relatedEntities);
        $this->assertArrayHasKey('aura_chats', $relatedEntities);
        $this->assertArrayHasKey('ads_campaigns', $relatedEntities);
        $this->assertArrayHasKey('ai_generations', $relatedEntities);
        $this->assertArrayHasKey('categories', $relatedEntities);
        $this->assertArrayHasKey('integrations', $relatedEntities);
        $this->assertArrayHasKey('nodered_flows', $relatedEntities);
        $this->assertArrayHasKey('products', $relatedEntities);
        $this->assertArrayHasKey('activities', $relatedEntities);
    }

    /**
     * Testa operações em lote
     */
    public function testBatchOperations(): void
    {
        // Criar usuário
        $user = new User(
            'Usuário Lote',
            'lote@example.com',
            'password123',
            'active'
        );

        // Criar projeto
        $project = new Project(
            'Projeto Lote',
            $user->getId(),
            'Projeto para testes em lote',
            'active',
            'medium',
            'web_development'
        );

        // Criar lead
        $lead = new Lead(
            'Lead Lote',
            'lead@example.com',
            $user->getId(),
            'active',
            'qualified',
            'website'
        );

        // Operações em lote
        $operations = [
            [
                'type' => 'user_creation',
                'data' => ['user' => $user]
            ],
            [
                'type' => 'project_creation',
                'data' => ['project' => $project, 'user' => $user]
            ],
            [
                'type' => 'lead_creation',
                'data' => ['lead' => $lead, 'user' => $user]
            ]
        ];

        // Executar operações em lote
        $results = $this->orchestrationService->orchestrateBatchOperations($operations);

        // Verificar resultados
        $this->assertIsArray($results);
        $this->assertCount(3, $results);

        // Verificar que não há erros
        foreach ($results as $result) {
            $this->assertArrayNotHasKey('error', $result);
        }
    }

    /**
     * Testa cache de validações
     */
    public function testValidationCache(): void
    {
        // Criar usuário
        $user = new User(
            'Usuário Cache',
            'cache@example.com',
            'password123',
            'active'
        );

        // Criar projeto
        $project = new Project(
            'Projeto Cache',
            $user->getId(),
            'Projeto para testes de cache',
            'active',
            'low',
            'web_development'
        );

        // Primeira validação (deve ser executada)
        $startTime = microtime(true);
        $errors1 = $this->validationService->validateUserProjectAssociation($user, $project);
        $firstExecutionTime = microtime(true) - $startTime;

        // Segunda validação (deve usar cache)
        $startTime = microtime(true);
        $errors2 = $this->validationService->validateUserProjectAssociation($user, $project);
        $secondExecutionTime = microtime(true) - $startTime;

        // Verificar que os resultados são iguais
        $this->assertEquals($errors1, $errors2);

        // Verificar que a segunda execução foi mais rápida (cache)
        $this->assertLessThan($firstExecutionTime, $secondExecutionTime);
    }

    /**
     * Testa estatísticas dos serviços
     */
    public function testServiceStats(): void
    {
        // Obter estatísticas do serviço de integração
        $integrationStats = $this->moduleIntegrationService->getStats();
        $this->assertIsArray($integrationStats);
        $this->assertArrayHasKey('timestamp', $integrationStats);

        // Obter estatísticas do serviço de validação
        $validationStats = $this->validationService->getValidationStats();
        $this->assertIsArray($validationStats);
        $this->assertArrayHasKey('cache_size', $validationStats);
        $this->assertArrayHasKey('cache_timeout', $validationStats);
        $this->assertArrayHasKey('timestamp', $validationStats);

        // Obter estatísticas do dispatcher de eventos
        $dispatcherStats = $this->eventDispatcher->getStats();
        $this->assertIsArray($dispatcherStats);
        $this->assertArrayHasKey('queue_size', $dispatcherStats);
        $this->assertArrayHasKey('processing_events', $dispatcherStats);
        $this->assertArrayHasKey('max_retries', $dispatcherStats);
        $this->assertArrayHasKey('retry_delay', $dispatcherStats);
        $this->assertArrayHasKey('timestamp', $dispatcherStats);

        // Obter estatísticas do serviço de relacionamentos
        $relationshipStats = $this->relationshipService->getStats();
        $this->assertIsArray($relationshipStats);
        $this->assertArrayHasKey('timestamp', $relationshipStats);

        // Obter estatísticas do serviço de orquestração
        $orchestrationStats = $this->orchestrationService->getOrchestrationStats();
        $this->assertIsArray($orchestrationStats);
        $this->assertArrayHasKey('timestamp', $orchestrationStats);
        $this->assertArrayHasKey('services', $orchestrationStats);
        $this->assertArrayHasKey('module_integration', $orchestrationStats['services']);
        $this->assertArrayHasKey('validation', $orchestrationStats['services']);
        $this->assertArrayHasKey('event_dispatcher', $orchestrationStats['services']);
        $this->assertArrayHasKey('relationship', $orchestrationStats['services']);
    }

    /**
     * Testa limpeza de cache
     */
    public function testCacheClearing(): void
    {
        // Limpar cache de validações
        $this->validationService->clearValidationCache();

        // Verificar que o cache foi limpo
        $stats = $this->validationService->getValidationStats();
        $this->assertEquals(0, $stats['cache_size']);

        // Limpar fila de eventos
        $this->eventDispatcher->clearQueue();

        // Verificar que a fila foi limpa
        $stats = $this->eventDispatcher->getStats();
        $this->assertEquals(0, $stats['queue_size']);
    }

    /**
     * Testa configuração de serviços
     */
    public function testServiceConfiguration(): void
    {
        // Configurar dispatcher de eventos
        $config = [
            'max_retries' => 5,
            'retry_delay' => 10
        ];

        $this->eventDispatcher->configure($config);

        // Verificar configuração
        $stats = $this->eventDispatcher->getStats();
        $this->assertEquals(5, $stats['max_retries']);
        $this->assertEquals(10, $stats['retry_delay']);

        // Configurar timeout do cache de validações
        $this->validationService->setCacheTimeout(600);

        // Verificar configuração
        $stats = $this->validationService->getValidationStats();
        $this->assertEquals(600, $stats['cache_timeout']);
    }

    /**
     * Testa tratamento de erros
     */
    public function testErrorHandling(): void
    {
        // Criar usuário inativo
        $inactiveUser = new User(
            'Usuário Inativo',
            'inativo@example.com',
            'password123',
            'inactive'
        );

        // Criar projeto
        $project = new Project(
            'Projeto Erro',
            $inactiveUser->getId(),
            'Projeto para testes de erro',
            'active',
            'high',
            'web_development'
        );

        // Tentar orquestrar criação de projeto com usuário inativo
        $results = $this->orchestrationService->orchestrateProjectCreation($project, $inactiveUser);

        // Verificar que há erro
        $this->assertArrayHasKey('error', $results);
        $this->assertStringContains('Validation failed', $results['error']);
    }

    /**
     * Testa performance de operações
     */
    public function testPerformance(): void
    {
        // Criar usuário
        $user = new User(
            'Usuário Performance',
            'performance@example.com',
            'password123',
            'active'
        );

        // Medir tempo de criação de usuário
        $startTime = microtime(true);
        $results = $this->orchestrationService->orchestrateUserCreation($user);
        $executionTime = microtime(true) - $startTime;

        // Verificar que a operação foi executada em tempo razoável (menos de 5 segundos)
        $this->assertLessThan(5.0, $executionTime);

        // Verificar que não há erros
        $this->assertArrayNotHasKey('error', $results);
    }
}