<?php

namespace App\Services\RouteFixAutomation\Testing;

use App\Services\RouteFixAutomation\Models\TestResult;
use Illuminate\Container\Container;

class ControllerTester
{
    private Container $app;
    
    // Controllers que realmente existem baseado na análise anterior
    private array $controllers = [
        // Auth Domain
        'App\Domains\Auth\Http\Controllers\AuthController',
        
        // Activity Domain  
        'App\Domains\Activity\Http\Controllers\ActivityLogController',
        
        // ADStool Domain
        'App\Domains\ADStool\Http\Controllers\AccountController',
        'App\Domains\ADStool\Http\Controllers\CampaignController', 
        'App\Domains\ADStool\Http\Controllers\CreativeController',
        'App\Domains\ADStool\Http\Controllers\ApiConfigurationController',
        
        // Analytics Domain
        'App\Domains\Analytics\Http\Controllers\AnalyticsController',
        
        // Aura Domain
        'App\Domains\Aura\Http\Controllers\WhatsAppWebhookController',
        'App\Domains\Aura\Http\Controllers\AuraChatController',
        'App\Domains\Aura\Http\Controllers\AuraConnectionController',
        'App\Domains\Aura\Http\Controllers\AuraFlowController',
        
        // AI Domain
        'App\Domains\AI\Http\Controllers\AIController',
        'App\Domains\AI\Http\Controllers\EnterpriseAIController',
        'App\Domains\AI\Http\Controllers\TextGenerationController',
        'App\Domains\AI\Http\Controllers\ImageGenerationController',
        'App\Domains\AI\Http\Controllers\VideoGenerationController',
        'App\Domains\AI\Http\Controllers\ChatController',
        'App\Domains\AI\Http\Controllers\AIGenerationController',
        'App\Domains\AI\Http\Controllers\GeminiController',
        
        // Core Domain
        'App\Domains\Core\Http\Controllers\UserApiConfigurationController',
        'App\Domains\Core\Http\Controllers\WhatsAppWebhookController',
        
        // Dashboard Domain
        'App\Domains\Dashboard\Http\Controllers\DashboardController',
        
        // EmailMarketing Domain
        'App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController',
        'App\Domains\EmailMarketing\Http\Controllers\EmailSegmentController',
        'App\Domains\EmailMarketing\Http\Controllers\EmailSubscriberController',
        'App\Domains\EmailMarketing\Http\Controllers\EmailTemplateController',
        'App\Domains\EmailMarketing\Http\Controllers\EmailListController',
        
        // Integrations Domain
        'App\Domains\Integrations\Http\Controllers\IntegrationController',
        
        // Media Domain
        'App\Domains\Media\Http\Controllers\MediaController',
        'App\Domains\Media\Http\Controllers\FolderController',
        
        // NodeRed Domain
        'App\Domains\NodeRed\Http\Controllers\NodeRedController',
        
        // Products Domain
        'App\Domains\Products\Http\Controllers\Api\LeadCaptureFormController',
        
        // Projects Domain
        'App\Domains\Projects\Http\Controllers\ProjectController',
        
        // Universe Domain
        'App\Domains\Universe\Http\Controllers\UniverseController',
        'App\Domains\Universe\Http\Controllers\AILaboratoryController',
        'App\Domains\Universe\Http\Controllers\ChatLabController',
        'App\Domains\Universe\Http\Controllers\AIIntegrationTestController',
        'App\Domains\Universe\Http\Controllers\UniverseAIController',
        'App\Domains\Universe\Http\Controllers\UniverseSnapshotController',
        'App\Domains\Universe\Http\Controllers\WebBrowserController',
        'App\Domains\Universe\Http\Controllers\UniverseAgentController',
        'App\Domains\Universe\Http\Controllers\UniverseTemplateController',
        
        // Users Domain
        'App\Domains\Users\Http\Controllers\UserController',
        'App\Domains\Users\Http\Controllers\Api\UserManagementController',
        'App\Domains\Users\Http\Controllers\ProfileController',
        'App\Domains\Users\Http\Controllers\NotificationController',
        'App\Domains\Users\Http\Controllers\UserPreferenceController',
        
        // Workflows Domain
        'App\Domains\Workflows\Http\Controllers\WorkflowController',
        'App\Domains\Workflows\Http\Controllers\WorkflowApiController',
        'App\Domains\Workflows\Http\Controllers\WorkflowCanvasController',
    ];

    public function __construct()
    {
        $this->app = app();
    }

    public function testAllControllers(): TestResult
    {
        $functionalList = [];
        $dependencyErrors = [];
        $generalErrors = [];

        foreach ($this->controllers as $controller) {
            try {
                // Teste 1: Classe existe?
                if (!class_exists($controller)) {
                    $generalErrors[] = "{$controller} - Classe não existe";
                    continue;
                }

                // Teste 2: É instanciável?
                $reflection = new \ReflectionClass($controller);
                if (!$reflection->isInstantiable()) {
                    $generalErrors[] = "{$controller} - Não instanciável";
                    continue;
                }

                // Teste 3: Container consegue resolver dependências?
                try {
                    $instance = $this->app->make($controller);
                    $functionalList[] = $controller;
                    
                } catch (\Illuminate\Contracts\Container\BindingResolutionException $e) {
                    $dependencyErrors[] = "{$controller} - Dependência não resolvida: " . $e->getMessage();
                } catch (\Exception $e) {
                    $generalErrors[] = "{$controller} - Erro geral: " . $e->getMessage();
                }
                
            } catch (\Exception $e) {
                $generalErrors[] = "{$controller} - Erro crítico: " . $e->getMessage();
            }
        }

        $functionalCount = count($functionalList);
        $totalCount = count($this->controllers);
        $successPercentage = round(($functionalCount / $totalCount) * 100, 2);

        $remainingIssues = array_merge($dependencyErrors, $generalErrors);

        return new TestResult(
            functionalControllers: $functionalCount,
            totalControllers: $totalCount,
            successPercentage: $successPercentage,
            functionalList: $functionalList,
            dependencyErrors: $dependencyErrors,
            generalErrors: $generalErrors,
            remainingIssues: $remainingIssues
        );
    }

    public function testSpecificController(string $controller): bool
    {
        try {
            if (!class_exists($controller)) {
                return false;
            }

            $reflection = new \ReflectionClass($controller);
            if (!$reflection->isInstantiable()) {
                return false;
            }

            $this->app->make($controller);
            return true;

        } catch (\Exception $e) {
            return false;
        }
    }

    public function generateProgressMetrics(): array
    {
        $testResult = $this->testAllControllers();
        
        return [
            'functional_controllers' => $testResult->functionalControllers,
            'total_controllers' => $testResult->totalControllers,
            'success_percentage' => $testResult->successPercentage,
            'dependency_errors_count' => count($testResult->dependencyErrors),
            'general_errors_count' => count($testResult->generalErrors),
            'remaining_issues_count' => count($testResult->remainingIssues)
        ];
    }
}