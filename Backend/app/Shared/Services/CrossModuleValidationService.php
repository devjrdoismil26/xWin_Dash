<?php

namespace App\Shared\Services;

use App\Shared\Validations\CrossModuleValidationRules;
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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Cross-Module Validation Service
 * 
 * Serviço central para validações que envolvem múltiplos módulos,
 * garantindo consistência e integridade entre entidades.
 */
class CrossModuleValidationService
{
    private array $validationCache = [];
    private int $cacheTimeout = 300; // 5 minutos

    /**
     * Valida associação entre usuário e projeto
     */
    public function validateUserProjectAssociation(User $user, Project $project): array
    {
        $cacheKey = "user_project_validation_{$user->getId()}_{$project->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($user, $project) {
            try {
                $errors = CrossModuleValidationRules::validateUserProjectAssociation($user, $project);
                
                Log::info('User-Project association validation completed', [
                    'user_id' => $user->getId(),
                    'project_id' => $project->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('User-Project association validation failed', [
                    'user_id' => $user->getId(),
                    'project_id' => $project->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida conversão de lead para usuário
     */
    public function validateLeadToUserConversion(Lead $lead): array
    {
        $cacheKey = "lead_conversion_validation_{$lead->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($lead) {
            try {
                $errors = CrossModuleValidationRules::validateLeadToUserConversion($lead);
                
                Log::info('Lead to user conversion validation completed', [
                    'lead_id' => $lead->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Lead to user conversion validation failed', [
                    'lead_id' => $lead->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida associação entre post e conta social
     */
    public function validatePostSocialAccountAssociation(Post $post, SocialAccount $socialAccount): array
    {
        $cacheKey = "post_social_validation_{$post->getId()}_{$socialAccount->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($post, $socialAccount) {
            try {
                $errors = CrossModuleValidationRules::validatePostSocialAccountAssociation($post, $socialAccount);
                
                Log::info('Post-SocialAccount association validation completed', [
                    'post_id' => $post->getId(),
                    'social_account_id' => $socialAccount->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Post-SocialAccount association validation failed', [
                    'post_id' => $post->getId(),
                    'social_account_id' => $socialAccount->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida envio de campanha de email
     */
    public function validateEmailCampaignSending(EmailCampaign $campaign, EmailList $emailList): array
    {
        $cacheKey = "email_campaign_validation_{$campaign->getId()}_{$emailList->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($campaign, $emailList) {
            try {
                $errors = CrossModuleValidationRules::validateEmailCampaignSending($campaign, $emailList);
                
                Log::info('Email campaign sending validation completed', [
                    'campaign_id' => $campaign->getId(),
                    'email_list_id' => $emailList->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Email campaign sending validation failed', [
                    'campaign_id' => $campaign->getId(),
                    'email_list_id' => $emailList->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida execução de workflow
     */
    public function validateWorkflowExecution(Workflow $workflow, array $context = []): array
    {
        $cacheKey = "workflow_execution_validation_{$workflow->getId()}_" . md5(serialize($context));
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($workflow, $context) {
            try {
                $errors = CrossModuleValidationRules::validateWorkflowExecution($workflow, $context);
                
                Log::info('Workflow execution validation completed', [
                    'workflow_id' => $workflow->getId(),
                    'context' => $context,
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Workflow execution validation failed', [
                    'workflow_id' => $workflow->getId(),
                    'context' => $context,
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida criação de instância de universo
     */
    public function validateUniverseInstanceCreation(UniverseInstance $instance, User $user): array
    {
        $cacheKey = "universe_instance_validation_{$instance->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($instance, $user) {
            try {
                $errors = CrossModuleValidationRules::validateUniverseInstanceCreation($instance, $user);
                
                Log::info('Universe instance creation validation completed', [
                    'instance_id' => $instance->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Universe instance creation validation failed', [
                    'instance_id' => $instance->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida associação entre mídia e pasta
     */
    public function validateMediaFolderAssociation(Media $media, Folder $folder): array
    {
        $cacheKey = "media_folder_validation_{$media->getId()}_{$folder->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($media, $folder) {
            try {
                $errors = CrossModuleValidationRules::validateMediaFolderAssociation($media, $folder);
                
                Log::info('Media-Folder association validation completed', [
                    'media_id' => $media->getId(),
                    'folder_id' => $folder->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Media-Folder association validation failed', [
                    'media_id' => $media->getId(),
                    'folder_id' => $folder->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida criação de métrica de analytics
     */
    public function validateAnalyticsMetricCreation(AnalyticsMetric $metric, array $context = []): array
    {
        $cacheKey = "analytics_metric_validation_{$metric->getId()}_" . md5(serialize($context));
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($metric, $context) {
            try {
                $errors = CrossModuleValidationRules::validateAnalyticsMetricCreation($metric, $context);
                
                Log::info('Analytics metric creation validation completed', [
                    'metric_id' => $metric->getId(),
                    'context' => $context,
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Analytics metric creation validation failed', [
                    'metric_id' => $metric->getId(),
                    'context' => $context,
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida criação de chat Aura
     */
    public function validateAuraChatCreation(AuraChat $chat, User $user): array
    {
        $cacheKey = "aura_chat_validation_{$chat->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($chat, $user) {
            try {
                $errors = CrossModuleValidationRules::validateAuraChatCreation($chat, $user);
                
                Log::info('Aura chat creation validation completed', [
                    'chat_id' => $chat->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Aura chat creation validation failed', [
                    'chat_id' => $chat->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida criação de campanha ADS
     */
    public function validateADSCampaignCreation(ADSCampaign $campaign, User $user): array
    {
        $cacheKey = "ads_campaign_validation_{$campaign->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($campaign, $user) {
            try {
                $errors = CrossModuleValidationRules::validateADSCampaignCreation($campaign, $user);
                
                Log::info('ADS campaign creation validation completed', [
                    'campaign_id' => $campaign->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('ADS campaign creation validation failed', [
                    'campaign_id' => $campaign->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida criação de geração de IA
     */
    public function validateAIGenerationCreation(AIGeneration $generation, User $user): array
    {
        $cacheKey = "ai_generation_validation_{$generation->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($generation, $user) {
            try {
                $errors = CrossModuleValidationRules::validateAIGenerationCreation($generation, $user);
                
                Log::info('AI generation creation validation completed', [
                    'generation_id' => $generation->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('AI generation creation validation failed', [
                    'generation_id' => $generation->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida associação de categoria
     */
    public function validateCategoryAssociation(Category $category, string $entityType, int $entityId): array
    {
        $cacheKey = "category_association_validation_{$category->getId()}_{$entityType}_{$entityId}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($category, $entityType, $entityId) {
            try {
                $errors = CrossModuleValidationRules::validateCategoryAssociation($category, $entityType, $entityId);
                
                Log::info('Category association validation completed', [
                    'category_id' => $category->getId(),
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Category association validation failed', [
                    'category_id' => $category->getId(),
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida ativação de integração
     */
    public function validateIntegrationActivation(Integration $integration, User $user): array
    {
        $cacheKey = "integration_activation_validation_{$integration->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($integration, $user) {
            try {
                $errors = CrossModuleValidationRules::validateIntegrationActivation($integration, $user);
                
                Log::info('Integration activation validation completed', [
                    'integration_id' => $integration->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Integration activation validation failed', [
                    'integration_id' => $integration->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida execução de fluxo NodeRed
     */
    public function validateNodeRedFlowExecution(NodeRedFlow $flow, User $user): array
    {
        $cacheKey = "nodered_flow_validation_{$flow->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($flow, $user) {
            try {
                $errors = CrossModuleValidationRules::validateNodeRedFlowExecution($flow, $user);
                
                Log::info('NodeRed flow execution validation completed', [
                    'flow_id' => $flow->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('NodeRed flow execution validation failed', [
                    'flow_id' => $flow->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida associação entre produto e projeto
     */
    public function validateProductProjectAssociation(Product $product, Project $project): array
    {
        $cacheKey = "product_project_validation_{$product->getId()}_{$project->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($product, $project) {
            try {
                $errors = CrossModuleValidationRules::validateProductProjectAssociation($product, $project);
                
                Log::info('Product-Project association validation completed', [
                    'product_id' => $product->getId(),
                    'project_id' => $project->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Product-Project association validation failed', [
                    'product_id' => $product->getId(),
                    'project_id' => $project->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida registro de atividade
     */
    public function validateActivityRegistration(Activity $activity, User $user): array
    {
        $cacheKey = "activity_registration_validation_{$activity->getId()}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($activity, $user) {
            try {
                $errors = CrossModuleValidationRules::validateActivityRegistration($activity, $user);
                
                Log::info('Activity registration validation completed', [
                    'activity_id' => $activity->getId(),
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Activity registration validation failed', [
                    'activity_id' => $activity->getId(),
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida deleção de entidade
     */
    public function validateEntityDeletion(string $entityType, int $entityId, User $user): array
    {
        $cacheKey = "entity_deletion_validation_{$entityType}_{$entityId}_{$user->getId()}";
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($entityType, $entityId, $user) {
            try {
                $errors = CrossModuleValidationRules::validateEntityDeletion($entityType, $entityId, $user);
                
                Log::info('Entity deletion validation completed', [
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'user_id' => $user->getId(),
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Entity deletion validation failed', [
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'user_id' => $user->getId(),
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida atualização de entidade
     */
    public function validateEntityUpdate(string $entityType, int $entityId, array $changes, User $user): array
    {
        $cacheKey = "entity_update_validation_{$entityType}_{$entityId}_{$user->getId()}_" . md5(serialize($changes));
        
        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($entityType, $entityId, $changes, $user) {
            try {
                $errors = CrossModuleValidationRules::validateEntityUpdate($entityType, $entityId, $changes, $user);
                
                Log::info('Entity update validation completed', [
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'user_id' => $user->getId(),
                    'changes' => $changes,
                    'errors_count' => count($errors)
                ]);

                return $errors;
            } catch (\Throwable $exception) {
                Log::error('Entity update validation failed', [
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'user_id' => $user->getId(),
                    'changes' => $changes,
                    'error' => $exception->getMessage()
                ]);

                return ['Erro interno durante validação'];
            }
        });
    }

    /**
     * Valida múltiplas operações em lote
     */
    public function validateBatchOperations(array $operations): array
    {
        $results = [];
        
        foreach ($operations as $operation) {
            $type = $operation['type'] ?? 'unknown';
            $data = $operation['data'] ?? [];
            
            try {
                switch ($type) {
                    case 'user_project_association':
                        $results[] = $this->validateUserProjectAssociation($data['user'], $data['project']);
                        break;
                        
                    case 'lead_conversion':
                        $results[] = $this->validateLeadToUserConversion($data['lead']);
                        break;
                        
                    case 'post_social_association':
                        $results[] = $this->validatePostSocialAccountAssociation($data['post'], $data['social_account']);
                        break;
                        
                    case 'email_campaign_sending':
                        $results[] = $this->validateEmailCampaignSending($data['campaign'], $data['email_list']);
                        break;
                        
                    case 'workflow_execution':
                        $results[] = $this->validateWorkflowExecution($data['workflow'], $data['context'] ?? []);
                        break;
                        
                    default:
                        $results[] = ['Tipo de operação não suportado'];
                }
            } catch (\Throwable $exception) {
                Log::error('Batch operation validation failed', [
                    'type' => $type,
                    'data' => $data,
                    'error' => $exception->getMessage()
                ]);
                
                $results[] = ['Erro interno durante validação'];
            }
        }
        
        return $results;
    }

    /**
     * Limpa cache de validações
     */
    public function clearValidationCache(): void
    {
        $this->validationCache = [];
        
        Log::info('Validation cache cleared');
    }

    /**
     * Define timeout do cache
     */
    public function setCacheTimeout(int $timeout): void
    {
        $this->cacheTimeout = $timeout;
        
        Log::info('Validation cache timeout updated', [
            'timeout' => $timeout
        ]);
    }

    /**
     * Obtém estatísticas de validação
     */
    public function getValidationStats(): array
    {
        return [
            'cache_size' => count($this->validationCache),
            'cache_timeout' => $this->cacheTimeout,
            'timestamp' => now()->toISOString()
        ];
    }
}