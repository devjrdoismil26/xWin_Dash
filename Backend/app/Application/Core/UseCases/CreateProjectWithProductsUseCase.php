<?php

namespace App\Application\Core\UseCases;

use App\Application\Core\Commands\CreateProjectWithProductsCommand;
use App\Domains\Projects\Services\ProjectService;
use App\Domains\Products\Services\ProductService;
use App\Domains\Universe\Services\UniverseService;
use App\Shared\Services\CrossModuleOrchestrationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * UseCase para criação de projeto com produtos e automações
 * Implementa o fluxo principal: Project → Products → Lead Capture → Automação
 */
class CreateProjectWithProductsUseCase
{
    protected ProjectService $projectService;
    protected ProductService $productService;
    protected UniverseService $universeService;
    protected CrossModuleOrchestrationService $orchestrationService;

    public function __construct(
        ProjectService $projectService,
        ProductService $productService,
        UniverseService $universeService,
        CrossModuleOrchestrationService $orchestrationService
    ) {
        $this->projectService = $projectService;
        $this->productService = $productService;
        $this->universeService = $universeService;
        $this->orchestrationService = $orchestrationService;
    }

    /**
     * Executa o caso de uso para criação de projeto completo
     *
     * @param CreateProjectWithProductsCommand $command
     * @return array
     */
    public function execute(CreateProjectWithProductsCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Criar projeto base
            $project = $this->createProject($command);

            // 2. Criar produtos/páginas de captura
            $products = $this->createProducts($project, $command);

            // 3. Configurar automações de leads
            $this->setupLeadAutomations($project, $products, $command);

            // 4. Ativar Universe como cérebro autônomo
            $universe = $this->activateUniverseBrain($project, $command);

            // 5. Configurar integrações cross-module
            $this->setupCrossModuleIntegrations($project, $products, $universe, $command);

            // 6. Inicializar workflows de automação
            $this->initializeAutomationWorkflows($project, $command);

            DB::commit();

            Log::info("Projeto completo criado com sucesso", [
                'project_id' => $project->id,
                'products_count' => count($products),
                'universe_id' => $universe->id,
                'user_id' => $command->userId
            ]);

            return [
                'project' => $project,
                'products' => $products,
                'universe' => $universe,
                'automations_configured' => true,
                'message' => 'Projeto criado com automações ativas'
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro na criação de projeto completo", [
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Cria o projeto base
     */
    private function createProject(CreateProjectWithProductsCommand $command): object
    {
        $projectData = [
            'name' => $command->projectName,
            'description' => $command->projectDescription,
            'user_id' => $command->userId,
            'status' => 'active',
            'type' => 'lead_generation',
            'settings' => [
                'lead_automation_enabled' => true,
                'universe_brain_enabled' => true,
                'cross_module_integration' => true,
                'ai_optimization' => $command->enableAI ?? true
            ]
        ];

        return $this->projectService->createProject($projectData);
    }

    /**
     * Cria produtos/páginas de captura
     */
    private function createProducts(object $project, CreateProjectWithProductsCommand $command): array
    {
        $products = [];

        foreach ($command->products as $productData) {
            $product = $this->productService->createProduct([
                'project_id' => $project->id,
                'name' => $productData['name'],
                'type' => 'lead_capture_page',
                'status' => 'active',
                'settings' => [
                    'lead_capture_enabled' => true,
                    'automation_triggers' => $productData['automation_triggers'] ?? [],
                    'form_fields' => $productData['form_fields'] ?? [],
                    'thank_you_page' => $productData['thank_you_page'] ?? null
                ],
                'content' => $productData['content'] ?? null,
                'seo_settings' => $productData['seo_settings'] ?? []
            ]);

            $products[] = $product;
        }

        return $products;
    }

    /**
     * Configura automações de leads
     */
    private function setupLeadAutomations(object $project, array $products, CreateProjectWithProductsCommand $command): void
    {
        foreach ($products as $product) {
            // Configurar automação de captura de leads
            $this->orchestrationService->setupProductLeadCapture($product, [
                'auto_scoring' => true,
                'auto_assignment' => true,
                'welcome_automation' => true,
                'source_tracking' => $product->name
            ]);

            // Configurar workflows específicos do produto
            $this->orchestrationService->createProductWorkflows($product, [
                'lead_qualification' => true,
                'email_nurturing' => true,
                'whatsapp_automation' => $command->enableWhatsApp ?? true,
                'social_media_tracking' => true
            ]);
        }
    }

    /**
     * Ativa Universe como cérebro autônomo
     */
    private function activateUniverseBrain(object $project, CreateProjectWithProductsCommand $command): object
    {
        $universeData = [
            'project_id' => $project->id,
            'name' => "Universe Brain - {$project->name}",
            'type' => 'autonomous_brain',
            'status' => 'active',
            'settings' => [
                'autonomous_mode' => true,
                'ai_decision_making' => true,
                'campaign_optimization' => true,
                'lead_analysis' => true,
                'performance_monitoring' => true,
                'auto_adjustments' => true
            ],
            'capabilities' => [
                'analyze_lead_quality',
                'optimize_campaigns',
                'adjust_automations',
                'predict_conversions',
                'recommend_actions'
            ]
        ];

        $universe = $this->universeService->createUniverse($universeData);

        // Ativar cérebro autônomo
        $this->orchestrationService->activateUniverseBrain($universe, [
            'monitoring_frequency' => 'real_time',
            'decision_threshold' => 0.8,
            'auto_actions' => true
        ]);

        return $universe;
    }

    /**
     * Configura integrações cross-module
     */
    private function setupCrossModuleIntegrations(object $project, array $products, object $universe, CreateProjectWithProductsCommand $command): void
    {
        // Integração com Analytics
        $this->orchestrationService->setupProjectAnalytics($project, [
            'track_lead_sources' => true,
            'monitor_conversion_funnels' => true,
            'analyze_campaign_performance' => true
        ]);

        // Integração com Email Marketing
        $this->orchestrationService->setupProjectEmailMarketing($project, [
            'auto_segmentation' => true,
            'nurturing_sequences' => true,
            'campaign_automation' => true
        ]);

        // Integração com Aura (WhatsApp)
        if ($command->enableWhatsApp) {
            $this->orchestrationService->setupProjectAura($project, [
                'auto_whatsapp_messages' => true,
                'lead_qualification_chat' => true,
                'appointment_scheduling' => true
            ]);
        }

        // Integração com ADStool
        $this->orchestrationService->setupProjectAdsTool($project, [
            'campaign_tracking' => true,
            'lead_attribution' => true,
            'roi_monitoring' => true
        ]);

        // Integração com Social Buffer
        $this->orchestrationService->setupProjectSocialBuffer($project, [
            'social_lead_tracking' => true,
            'content_automation' => true,
            'engagement_monitoring' => true
        ]);
    }

    /**
     * Inicializa workflows de automação
     */
    private function initializeAutomationWorkflows(object $project, CreateProjectWithProductsCommand $command): void
    {
        // Workflow principal de captura de leads
        $this->orchestrationService->createLeadCaptureWorkflow($project, [
            'trigger' => 'lead_captured',
            'actions' => [
                'score_lead',
                'assign_lead',
                'send_welcome_email',
                'trigger_whatsapp_sequence',
                'add_to_nurturing_campaign',
                'notify_universe_brain'
            ]
        ]);

        // Workflow de qualificação de leads
        $this->orchestrationService->createLeadQualificationWorkflow($project, [
            'trigger' => 'lead_qualified',
            'actions' => [
                'escalate_to_sales',
                'schedule_follow_up',
                'update_campaign_targeting',
                'optimize_landing_pages'
            ]
        ]);

        // Workflow de conversão
        $this->orchestrationService->createConversionWorkflow($project, [
            'trigger' => 'lead_converted',
            'actions' => [
                'celebrate_conversion',
                'update_roi_metrics',
                'optimize_successful_campaigns',
                'create_customer_journey'
            ]
        ]);
    }
}