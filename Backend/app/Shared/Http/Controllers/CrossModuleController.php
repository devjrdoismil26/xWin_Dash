<?php

namespace App\Shared\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Shared\Services\ModuleIntegrationService;
use App\Shared\Services\CrossModuleRelationshipService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\BaseDomainEvent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * Controller para operações cross-module
 * 
 * Fornece endpoints para gerenciar integrações
 * entre diferentes módulos do sistema.
 */
class CrossModuleController extends Controller
{
    private ModuleIntegrationService $moduleIntegrationService;
    private CrossModuleRelationshipService $relationshipService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        ModuleIntegrationService $moduleIntegrationService,
        CrossModuleRelationshipService $relationshipService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->moduleIntegrationService = $moduleIntegrationService;
        $this->relationshipService = $relationshipService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Obtém relacionamentos de um usuário
     */
    public function getUserRelationships(int $userId): JsonResponse
    {
        try {
            $relationships = $this->relationshipService->getUserRelatedEntities($userId);

            return response()->json([
                'success' => true,
                'data' => $relationships,
                'message' => 'Relacionamentos obtidos com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error getting user relationships', [
                'user_id' => $userId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter relacionamentos do usuário',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém relacionamentos de um projeto
     */
    public function getProjectRelationships(int $projectId): JsonResponse
    {
        try {
            $relationships = $this->relationshipService->getProjectRelatedEntities($projectId);

            return response()->json([
                'success' => true,
                'data' => $relationships,
                'message' => 'Relacionamentos do projeto obtidos com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error getting project relationships', [
                'project_id' => $projectId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter relacionamentos do projeto',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém relacionamentos de um lead
     */
    public function getLeadRelationships(int $leadId): JsonResponse
    {
        try {
            $relationships = $this->relationshipService->getLeadRelatedEntities($leadId);

            return response()->json([
                'success' => true,
                'data' => $relationships,
                'message' => 'Relacionamentos do lead obtidos com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error getting lead relationships', [
                'lead_id' => $leadId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter relacionamentos do lead',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Valida uma operação cross-module
     */
    public function validateOperation(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'operation' => 'required|string',
                'data' => 'required|array',
                'context' => 'sometimes|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Dados de validação inválidos',
                    'details' => $validator->errors()
                ], 422);
            }

            $operation = $request->input('operation');
            $data = $request->input('data');
            $context = $request->input('context', []);

            $errors = $this->validateOperationData($operation, $data, $context);

            return response()->json([
                'success' => empty($errors),
                'data' => [
                    'operation' => $operation,
                    'valid' => empty($errors),
                    'errors' => $errors
                ],
                'message' => empty($errors) ? 'Operação válida' : 'Operação inválida'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error validating operation', [
                'operation' => $request->input('operation'),
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao validar operação',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Dispara um evento cross-module
     */
    public function dispatchEvent(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'event_type' => 'required|string',
                'payload' => 'required|array',
                'user_id' => 'sometimes|integer',
                'project_id' => 'sometimes|integer',
                'metadata' => 'sometimes|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Dados do evento inválidos',
                    'details' => $validator->errors()
                ], 422);
            }

            $eventType = $request->input('event_type');
            $payload = $request->input('payload');
            $userId = $request->input('user_id');
            $projectId = $request->input('project_id');
            $metadata = $request->input('metadata', []);

            $event = $this->createEventFromType($eventType, $payload, $userId, $projectId, $metadata);

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Tipo de evento não suportado',
                    'message' => "Tipo de evento '{$eventType}' não é suportado"
                ], 422);
            }

            $this->eventDispatcher->dispatch($event);

            return response()->json([
                'success' => true,
                'data' => [
                    'event_id' => $event->eventId,
                    'event_type' => $event->getEventType(),
                    'dispatched_at' => $event->occurredAt->toISOString()
                ],
                'message' => 'Evento disparado com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error dispatching event', [
                'event_type' => $request->input('event_type'),
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao disparar evento',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém estatísticas do sistema cross-module
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = [
                'dispatcher' => $this->eventDispatcher->getStats(),
                'validation' => $this->validationService->getValidationStats(),
                'relationships' => $this->relationshipService->getStats(),
                'integrations' => $this->moduleIntegrationService->getStats()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estatísticas obtidas com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error getting stats', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter estatísticas',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Processa fila de eventos
     */
    public function processEventQueue(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 100);
            $timeout = $request->input('timeout', 300);

            $pendingEvents = $this->eventDispatcher->getPendingEvents();
            $eventsToProcess = array_slice($pendingEvents, 0, $limit);

            $this->eventDispatcher->processBatch($eventsToProcess);

            return response()->json([
                'success' => true,
                'data' => [
                    'processed_count' => count($eventsToProcess),
                    'remaining_count' => count($pendingEvents) - count($eventsToProcess),
                    'limit' => $limit,
                    'timeout' => $timeout
                ],
                'message' => 'Fila de eventos processada com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error processing event queue', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao processar fila de eventos',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Limpa cache do sistema
     */
    public function clearCache(Request $request): JsonResponse
    {
        try {
            $type = $request->input('type', 'all');

            switch ($type) {
                case 'all':
                    $this->validationService->clearValidationCache();
                    $this->eventDispatcher->clearQueue();
                    break;

                case 'validations':
                    $this->validationService->clearValidationCache();
                    break;

                case 'events':
                    $this->eventDispatcher->clearQueue();
                    break;

                default:
                    return response()->json([
                        'success' => false,
                        'error' => 'Tipo de cache inválido',
                        'message' => "Tipo '{$type}' não é suportado"
                    ], 422);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'cache_type' => $type,
                    'cleared_at' => now()->toISOString()
                ],
                'message' => 'Cache limpo com sucesso'
            ]);

        } catch (\Throwable $exception) {
            Log::error('Error clearing cache', [
                'cache_type' => $request->input('type'),
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao limpar cache',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Valida dados de uma operação
     */
    private function validateOperationData(string $operation, array $data, array $context): array
    {
        try {
            switch ($operation) {
                case 'user_project_association':
                    return $this->validateUserProjectAssociation($data, $context);

                case 'lead_conversion':
                    return $this->validateLeadConversion($data, $context);

                case 'post_social_association':
                    return $this->validatePostSocialAssociation($data, $context);

                case 'email_campaign_sending':
                    return $this->validateEmailCampaignSending($data, $context);

                case 'workflow_execution':
                    return $this->validateWorkflowExecution($data, $context);

                case 'universe_instance_creation':
                    return $this->validateUniverseInstanceCreation($data, $context);

                case 'media_folder_association':
                    return $this->validateMediaFolderAssociation($data, $context);

                case 'analytics_metric_creation':
                    return $this->validateAnalyticsMetricCreation($data, $context);

                case 'aura_chat_creation':
                    return $this->validateAuraChatCreation($data, $context);

                case 'ads_campaign_creation':
                    return $this->validateADSCampaignCreation($data, $context);

                case 'ai_generation_creation':
                    return $this->validateAIGenerationCreation($data, $context);

                case 'category_association':
                    return $this->validateCategoryAssociation($data, $context);

                case 'integration_activation':
                    return $this->validateIntegrationActivation($data, $context);

                case 'nodered_flow_execution':
                    return $this->validateNodeRedFlowExecution($data, $context);

                case 'product_project_association':
                    return $this->validateProductProjectAssociation($data, $context);

                case 'activity_registration':
                    return $this->validateActivityRegistration($data, $context);

                case 'entity_deletion':
                    return $this->validateEntityDeletion($data, $context);

                case 'entity_update':
                    return $this->validateEntityUpdate($data, $context);

                default:
                    return ["Operação '{$operation}' não é suportada"];
            }

        } catch (\Throwable $exception) {
            Log::error('Error validating operation data', [
                'operation' => $operation,
                'error' => $exception->getMessage()
            ]);

            return ['Erro interno durante validação'];
        }
    }

    /**
     * Cria evento baseado no tipo
     */
    private function createEventFromType(string $eventType, array $payload, ?int $userId, ?int $projectId, array $metadata): ?BaseDomainEvent
    {
        try {
            switch ($eventType) {
                case 'user.created':
                    return new \App\Shared\Events\UserCreatedEvent(
                        userId: $payload['user_id'] ?? 0,
                        userName: $payload['user_name'] ?? '',
                        userEmail: $payload['user_email'] ?? '',
                        projectId: $projectId,
                        metadata: $metadata
                    );

                case 'project.created':
                    return new \App\Shared\Events\ProjectCreatedEvent(
                        projectId: $payload['project_id'] ?? 0,
                        projectName: $payload['project_name'] ?? '',
                        userId: $userId ?? 0,
                        projectType: $payload['project_type'] ?? null,
                        metadata: $metadata
                    );

                case 'lead.created':
                    return new \App\Shared\Events\LeadCreatedEvent(
                        leadId: $payload['lead_id'] ?? 0,
                        leadName: $payload['lead_name'] ?? '',
                        leadEmail: $payload['lead_email'] ?? '',
                        userId: $userId ?? 0,
                        projectId: $projectId,
                        leadSource: $payload['lead_source'] ?? null,
                        metadata: $metadata
                    );

                case 'email_campaign.created':
                    return new \App\Shared\Events\EmailCampaignCreatedEvent(
                        campaignId: $payload['campaign_id'] ?? 0,
                        campaignName: $payload['campaign_name'] ?? '',
                        userId: $userId ?? 0,
                        projectId: $projectId,
                        campaignType: $payload['campaign_type'] ?? null,
                        metadata: $metadata
                    );

                case 'post.published':
                    return new \App\Shared\Events\PostPublishedEvent(
                        postId: $payload['post_id'] ?? 0,
                        postContent: $payload['post_content'] ?? '',
                        userId: $userId ?? 0,
                        projectId: $projectId,
                        postType: $payload['post_type'] ?? null,
                        socialAccounts: $payload['social_accounts'] ?? null,
                        metadata: $metadata
                    );

                default:
                    return null;
            }

        } catch (\Throwable $exception) {
            Log::error('Error creating event from type', [
                'event_type' => $eventType,
                'error' => $exception->getMessage()
            ]);

            return null;
        }
    }

    // Métodos de validação específicos (implementar conforme necessário)

    private function validateUserProjectAssociation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateLeadConversion(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validatePostSocialAssociation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateEmailCampaignSending(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateWorkflowExecution(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateUniverseInstanceCreation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateMediaFolderAssociation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateAnalyticsMetricCreation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateAuraChatCreation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateADSCampaignCreation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateAIGenerationCreation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateCategoryAssociation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateIntegrationActivation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateNodeRedFlowExecution(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateProductProjectAssociation(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateActivityRegistration(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateEntityDeletion(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }

    private function validateEntityUpdate(array $data, array $context): array
    {
        // Implementar validação específica
        return [];
    }
}