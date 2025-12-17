<?php

namespace App\Shared\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

/**
 * Middleware para validação cross-module
 * 
 * Valida operações que envolvem múltiplos módulos
 * antes de permitir que sejam executadas.
 */
class CrossModuleValidationMiddleware
{
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $operation = null): mixed
    {
        try {
            // Verificar se o usuário está autenticado
            if (!Auth::check()) {
                return response()->json([
                    'error' => 'Usuário não autenticado',
                    'message' => 'É necessário estar logado para realizar esta operação'
                ], 401);
            }

            $user = Auth::user();

            // Validar operação específica se fornecida
            if ($operation) {
                $validationResult = $this->validateOperation($request, $operation, $user);
                
                if (!$validationResult['valid']) {
                    return response()->json([
                        'error' => 'Validação cross-module falhou',
                        'message' => 'Operação não pode ser executada',
                        'details' => $validationResult['errors']
                    ], 422);
                }
            }

            // Validar operações baseadas na rota
            $routeValidation = $this->validateRoute($request, $user);
            
            if (!$routeValidation['valid']) {
                return response()->json([
                    'error' => 'Validação de rota falhou',
                    'message' => 'Rota não pode ser acessada',
                    'details' => $routeValidation['errors']
                ], 422);
            }

            // Log da validação bem-sucedida
            Log::info('Cross-module validation passed', [
                'user_id' => $user->id,
                'route' => $request->route()->getName(),
                'operation' => $operation,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return $next($request);

        } catch (\Throwable $exception) {
            Log::error('Cross-module validation middleware error', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => Auth::id(),
                'route' => $request->route()->getName(),
                'operation' => $operation
            ]);

            return response()->json([
                'error' => 'Erro interno de validação',
                'message' => 'Ocorreu um erro durante a validação da operação'
            ], 500);
        }
    }

    /**
     * Valida uma operação específica
     */
    private function validateOperation(Request $request, string $operation, $user): array
    {
        $errors = [];

        try {
            switch ($operation) {
                case 'user_project_association':
                    $errors = $this->validateUserProjectAssociation($request, $user);
                    break;

                case 'lead_conversion':
                    $errors = $this->validateLeadConversion($request, $user);
                    break;

                case 'post_social_association':
                    $errors = $this->validatePostSocialAssociation($request, $user);
                    break;

                case 'email_campaign_sending':
                    $errors = $this->validateEmailCampaignSending($request, $user);
                    break;

                case 'workflow_execution':
                    $errors = $this->validateWorkflowExecution($request, $user);
                    break;

                case 'universe_instance_creation':
                    $errors = $this->validateUniverseInstanceCreation($request, $user);
                    break;

                case 'media_folder_association':
                    $errors = $this->validateMediaFolderAssociation($request, $user);
                    break;

                case 'analytics_metric_creation':
                    $errors = $this->validateAnalyticsMetricCreation($request, $user);
                    break;

                case 'aura_chat_creation':
                    $errors = $this->validateAuraChatCreation($request, $user);
                    break;

                case 'ads_campaign_creation':
                    $errors = $this->validateADSCampaignCreation($request, $user);
                    break;

                case 'ai_generation_creation':
                    $errors = $this->validateAIGenerationCreation($request, $user);
                    break;

                case 'category_association':
                    $errors = $this->validateCategoryAssociation($request, $user);
                    break;

                case 'integration_activation':
                    $errors = $this->validateIntegrationActivation($request, $user);
                    break;

                case 'nodered_flow_execution':
                    $errors = $this->validateNodeRedFlowExecution($request, $user);
                    break;

                case 'product_project_association':
                    $errors = $this->validateProductProjectAssociation($request, $user);
                    break;

                case 'activity_registration':
                    $errors = $this->validateActivityRegistration($request, $user);
                    break;

                case 'entity_deletion':
                    $errors = $this->validateEntityDeletion($request, $user);
                    break;

                case 'entity_update':
                    $errors = $this->validateEntityUpdate($request, $user);
                    break;

                default:
                    $errors[] = "Operação '{$operation}' não é suportada";
            }

        } catch (\Throwable $exception) {
            Log::error('Operation validation error', [
                'operation' => $operation,
                'error' => $exception->getMessage(),
                'user_id' => $user->id
            ]);

            $errors[] = 'Erro interno durante validação da operação';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Valida operações baseadas na rota
     */
    private function validateRoute(Request $request, $user): array
    {
        $errors = [];
        $routeName = $request->route()->getName();

        try {
            // Validar rotas de criação
            if (str_contains($routeName, '.store') || str_contains($routeName, '.create')) {
                $errors = array_merge($errors, $this->validateCreationRoute($request, $user));
            }

            // Validar rotas de atualização
            if (str_contains($routeName, '.update') || str_contains($routeName, '.edit')) {
                $errors = array_merge($errors, $this->validateUpdateRoute($request, $user));
            }

            // Validar rotas de deleção
            if (str_contains($routeName, '.destroy') || str_contains($routeName, '.delete')) {
                $errors = array_merge($errors, $this->validateDeletionRoute($request, $user));
            }

            // Validar rotas de execução
            if (str_contains($routeName, '.execute') || str_contains($routeName, '.run')) {
                $errors = array_merge($errors, $this->validateExecutionRoute($request, $user));
            }

        } catch (\Throwable $exception) {
            Log::error('Route validation error', [
                'route' => $routeName,
                'error' => $exception->getMessage(),
                'user_id' => $user->id
            ]);

            $errors[] = 'Erro interno durante validação da rota';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    // Métodos de validação específicos

    private function validateUserProjectAssociation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateLeadConversion(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validatePostSocialAssociation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateEmailCampaignSending(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateWorkflowExecution(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateUniverseInstanceCreation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateMediaFolderAssociation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateAnalyticsMetricCreation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateAuraChatCreation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateADSCampaignCreation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateAIGenerationCreation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateCategoryAssociation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateIntegrationActivation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateNodeRedFlowExecution(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateProductProjectAssociation(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateActivityRegistration(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateEntityDeletion(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateEntityUpdate(Request $request, $user): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateCreationRoute(Request $request, $user): array
    {
        // Implementar validação específica para rotas de criação
        return [];
    }

    private function validateUpdateRoute(Request $request, $user): array
    {
        // Implementar validação específica para rotas de atualização
        return [];
    }

    private function validateDeletionRoute(Request $request, $user): array
    {
        // Implementar validação específica para rotas de deleção
        return [];
    }

    private function validateExecutionRoute(Request $request, $user): array
    {
        // Implementar validação específica para rotas de execução
        return [];
    }
}