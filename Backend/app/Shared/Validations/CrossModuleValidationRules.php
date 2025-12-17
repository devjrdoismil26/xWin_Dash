<?php

namespace App\Shared\Validations;

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

/**
 * Cross-Module Validation Rules
 * 
 * Define regras de validação que envolvem múltiplos módulos,
 * garantindo consistência e integridade entre entidades.
 */
class CrossModuleValidationRules
{
    /**
     * Valida se um usuário pode ser associado a um projeto
     */
    public static function validateUserProjectAssociation(User $user, Project $project): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para ser associado a projetos";
        }

        // Verificar se o projeto está em um status válido
        if ($project->isArchived() || $project->isCancelled()) {
            $errors[] = "Projeto deve estar ativo para associar usuários";
        }

        // Verificar se o usuário não excede limite de projetos
        if ($user->getProjectCount() >= $user->getMaxProjects()) {
            $errors[] = "Usuário excedeu o limite máximo de projetos";
        }

        // Verificar se o projeto não excede limite de membros
        if ($project->getTeamMemberCount() >= $project->getMaxTeamMembers()) {
            $errors[] = "Projeto excedeu o limite máximo de membros da equipe";
        }

        return $errors;
    }

    /**
     * Valida se um lead pode ser convertido em usuário
     */
    public static function validateLeadToUserConversion(Lead $lead): array
    {
        $errors = [];

        // Verificar se o lead está qualificado
        if (!$lead->isQualified()) {
            $errors[] = "Lead deve estar qualificado para conversão";
        }

        // Verificar se o lead tem informações mínimas necessárias
        if (empty($lead->getEmail()) || empty($lead->getName())) {
            $errors[] = "Lead deve ter email e nome para conversão";
        }

        // Verificar se o lead não está duplicado
        if ($lead->isDuplicate()) {
            $errors[] = "Lead duplicado não pode ser convertido";
        }

        // Verificar se o lead não está em processo de conversão
        if ($lead->isConverting()) {
            $errors[] = "Lead já está em processo de conversão";
        }

        return $errors;
    }

    /**
     * Valida se um post pode ser publicado em uma conta social
     */
    public static function validatePostSocialAccountAssociation(Post $post, SocialAccount $socialAccount): array
    {
        $errors = [];

        // Verificar se a conta social está ativa
        if (!$socialAccount->isActive()) {
            $errors[] = "Conta social deve estar ativa para publicar posts";
        }

        // Verificar se o post está em status válido
        if (!$post->canBePublished()) {
            $errors[] = "Post deve estar em status válido para publicação";
        }

        // Verificar compatibilidade de tipo de post com a plataforma
        if (!$socialAccount->supportsPostType($post->getType())) {
            $errors[] = "Tipo de post não é compatível com a plataforma da conta social";
        }

        // Verificar se a conta social não excedeu limite de posts
        if ($socialAccount->getDailyPostCount() >= $socialAccount->getDailyPostLimit()) {
            $errors[] = "Conta social excedeu o limite diário de posts";
        }

        // Verificar se o post não excede limite de caracteres da plataforma
        if ($post->getContentLength() > $socialAccount->getMaxPostLength()) {
            $errors[] = "Post excede o limite de caracteres da plataforma";
        }

        return $errors;
    }

    /**
     * Valida se uma campanha de email pode ser enviada
     */
    public static function validateEmailCampaignSending(EmailCampaign $campaign, EmailList $emailList): array
    {
        $errors = [];

        // Verificar se a campanha está em status válido
        if (!$campaign->canBeSent()) {
            $errors[] = "Campanha deve estar em status válido para envio";
        }

        // Verificar se a lista de email está ativa
        if (!$emailList->isActive()) {
            $errors[] = "Lista de email deve estar ativa para envio de campanhas";
        }

        // Verificar se a lista tem assinantes suficientes
        if ($emailList->getActiveSubscriberCount() < $campaign->getMinSubscribersRequired()) {
            $errors[] = "Lista de email deve ter assinantes suficientes para envio";
        }

        // Verificar se a campanha não excede limite de envios
        if ($campaign->getSentCount() >= $campaign->getMaxSends()) {
            $errors[] = "Campanha excedeu o limite máximo de envios";
        }

        // Verificar se a campanha tem conteúdo válido
        if (empty($campaign->getSubject()) || empty($campaign->getContent())) {
            $errors[] = "Campanha deve ter assunto e conteúdo para envio";
        }

        return $errors;
    }

    /**
     * Valida se um workflow pode ser executado
     */
    public static function validateWorkflowExecution(Workflow $workflow, array $context = []): array
    {
        $errors = [];

        // Verificar se o workflow está ativo
        if (!$workflow->isActive()) {
            $errors[] = "Workflow deve estar ativo para execução";
        }

        // Verificar se o workflow não está em manutenção
        if ($workflow->isInMaintenance()) {
            $errors[] = "Workflow está em manutenção e não pode ser executado";
        }

        // Verificar se o workflow tem ações definidas
        if (empty($workflow->getActions())) {
            $errors[] = "Workflow deve ter ações definidas para execução";
        }

        // Verificar se o workflow não excedeu limite de execuções
        if ($workflow->getExecutionCount() >= $workflow->getMaxExecutions()) {
            $errors[] = "Workflow excedeu o limite máximo de execuções";
        }

        // Verificar se o workflow tem permissões adequadas
        if (isset($context['userId']) && !$workflow->canBeExecutedBy($context['userId'])) {
            $errors[] = "Usuário não tem permissão para executar este workflow";
        }

        return $errors;
    }

    /**
     * Valida se uma instância de universo pode ser criada
     */
    public static function validateUniverseInstanceCreation(UniverseInstance $instance, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para criar instâncias de universo";
        }

        // Verificar se o usuário não excedeu limite de instâncias
        if ($user->getUniverseInstanceCount() >= $user->getMaxUniverseInstances()) {
            $errors[] = "Usuário excedeu o limite máximo de instâncias de universo";
        }

        // Verificar se a instância tem configuração válida
        if (empty($instance->getConfiguration())) {
            $errors[] = "Instância deve ter configuração válida";
        }

        // Verificar se a instância não está duplicada
        if ($instance->isDuplicate()) {
            $errors[] = "Instância duplicada não pode ser criada";
        }

        return $errors;
    }

    /**
     * Valida se uma mídia pode ser associada a uma pasta
     */
    public static function validateMediaFolderAssociation(Media $media, Folder $folder): array
    {
        $errors = [];

        // Verificar se a pasta está ativa
        if (!$folder->isActive()) {
            $errors[] = "Pasta deve estar ativa para associar mídias";
        }

        // Verificar se a mídia está em status válido
        if (!$media->isReady()) {
            $errors[] = "Mídia deve estar pronta para ser associada a pastas";
        }

        // Verificar se a pasta não excedeu limite de mídias
        if ($folder->getMediaCount() >= $folder->getMaxMediaCount()) {
            $errors[] = "Pasta excedeu o limite máximo de mídias";
        }

        // Verificar se a mídia é compatível com o tipo de pasta
        if (!$folder->supportsMediaType($media->getType())) {
            $errors[] = "Tipo de mídia não é compatível com o tipo de pasta";
        }

        return $errors;
    }

    /**
     * Valida se uma métrica de analytics pode ser criada
     */
    public static function validateAnalyticsMetricCreation(AnalyticsMetric $metric, array $context = []): array
    {
        $errors = [];

        // Verificar se a métrica tem nome válido
        if (empty($metric->getName())) {
            $errors[] = "Métrica deve ter nome válido";
        }

        // Verificar se a métrica tem valor válido
        if ($metric->getValue() === null) {
            $errors[] = "Métrica deve ter valor válido";
        }

        // Verificar se a métrica não está duplicada
        if ($metric->isDuplicate()) {
            $errors[] = "Métrica duplicada não pode ser criada";
        }

        // Verificar se a métrica tem contexto válido
        if (empty($context)) {
            $errors[] = "Métrica deve ter contexto válido";
        }

        return $errors;
    }

    /**
     * Valida se um chat Aura pode ser criado
     */
    public static function validateAuraChatCreation(AuraChat $chat, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para criar chats Aura";
        }

        // Verificar se o usuário não excedeu limite de chats
        if ($user->getAuraChatCount() >= $user->getMaxAuraChats()) {
            $errors[] = "Usuário excedeu o limite máximo de chats Aura";
        }

        // Verificar se o chat tem configuração válida
        if (empty($chat->getConfiguration())) {
            $errors[] = "Chat deve ter configuração válida";
        }

        // Verificar se o chat não está duplicado
        if ($chat->isDuplicate()) {
            $errors[] = "Chat duplicado não pode ser criado";
        }

        return $errors;
    }

    /**
     * Valida se uma campanha ADS pode ser criada
     */
    public static function validateADSCampaignCreation(ADSCampaign $campaign, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para criar campanhas ADS";
        }

        // Verificar se o usuário não excedeu limite de campanhas
        if ($user->getADSCampaignCount() >= $user->getMaxADSCampaigns()) {
            $errors[] = "Usuário excedeu o limite máximo de campanhas ADS";
        }

        // Verificar se a campanha tem orçamento válido
        if ($campaign->getBudget() <= 0) {
            $errors[] = "Campanha deve ter orçamento válido";
        }

        // Verificar se a campanha tem público-alvo definido
        if (empty($campaign->getTargetAudience())) {
            $errors[] = "Campanha deve ter público-alvo definido";
        }

        return $errors;
    }

    /**
     * Valida se uma geração de IA pode ser criada
     */
    public static function validateAIGenerationCreation(AIGeneration $generation, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para criar gerações de IA";
        }

        // Verificar se o usuário não excedeu limite de gerações
        if ($user->getAIGenerationCount() >= $user->getMaxAIGenerations()) {
            $errors[] = "Usuário excedeu o limite máximo de gerações de IA";
        }

        // Verificar se a geração tem prompt válido
        if (empty($generation->getPrompt())) {
            $errors[] = "Geração deve ter prompt válido";
        }

        // Verificar se a geração tem tipo válido
        if (empty($generation->getType())) {
            $errors[] = "Geração deve ter tipo válido";
        }

        return $errors;
    }

    /**
     * Valida se uma categoria pode ser associada a uma entidade
     */
    public static function validateCategoryAssociation(Category $category, string $entityType, int $entityId): array
    {
        $errors = [];

        // Verificar se a categoria está ativa
        if (!$category->isActive()) {
            $errors[] = "Categoria deve estar ativa para associação";
        }

        // Verificar se a categoria suporta o tipo de entidade
        if (!$category->supportsEntityType($entityType)) {
            $errors[] = "Categoria não suporta o tipo de entidade especificado";
        }

        // Verificar se a categoria não excedeu limite de associações
        if ($category->getAssociationCount() >= $category->getMaxAssociations()) {
            $errors[] = "Categoria excedeu o limite máximo de associações";
        }

        return $errors;
    }

    /**
     * Valida se uma integração pode ser ativada
     */
    public static function validateIntegrationActivation(Integration $integration, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para ativar integrações";
        }

        // Verificar se a integração está disponível
        if (!$integration->isAvailable()) {
            $errors[] = "Integração não está disponível";
        }

        // Verificar se a integração tem configuração válida
        if (empty($integration->getConfiguration())) {
            $errors[] = "Integração deve ter configuração válida";
        }

        // Verificar se o usuário não excedeu limite de integrações
        if ($user->getIntegrationCount() >= $user->getMaxIntegrations()) {
            $errors[] = "Usuário excedeu o limite máximo de integrações";
        }

        return $errors;
    }

    /**
     * Valida se um fluxo NodeRed pode ser executado
     */
    public static function validateNodeRedFlowExecution(NodeRedFlow $flow, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para executar fluxos NodeRed";
        }

        // Verificar se o fluxo está ativo
        if (!$flow->isActive()) {
            $errors[] = "Fluxo deve estar ativo para execução";
        }

        // Verificar se o fluxo tem nós definidos
        if (empty($flow->getNodes())) {
            $errors[] = "Fluxo deve ter nós definidos para execução";
        }

        // Verificar se o usuário tem permissão para executar o fluxo
        if (!$flow->canBeExecutedBy($user->getId())) {
            $errors[] = "Usuário não tem permissão para executar este fluxo";
        }

        return $errors;
    }

    /**
     * Valida se um produto pode ser associado a um projeto
     */
    public static function validateProductProjectAssociation(Product $product, Project $project): array
    {
        $errors = [];

        // Verificar se o produto está ativo
        if (!$product->isActive()) {
            $errors[] = "Produto deve estar ativo para associação";
        }

        // Verificar se o projeto está ativo
        if (!$project->isActive()) {
            $errors[] = "Projeto deve estar ativo para associação";
        }

        // Verificar se o produto é compatível com o tipo de projeto
        if (!$product->isCompatibleWithProjectType($project->getType())) {
            $errors[] = "Produto não é compatível com o tipo de projeto";
        }

        // Verificar se o projeto não excedeu limite de produtos
        if ($project->getProductCount() >= $project->getMaxProducts()) {
            $errors[] = "Projeto excedeu o limite máximo de produtos";
        }

        return $errors;
    }

    /**
     * Valida se uma atividade pode ser registrada
     */
    public static function validateActivityRegistration(Activity $activity, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para registrar atividades";
        }

        // Verificar se a atividade tem tipo válido
        if (empty($activity->getType())) {
            $errors[] = "Atividade deve ter tipo válido";
        }

        // Verificar se a atividade tem descrição válida
        if (empty($activity->getDescription())) {
            $errors[] = "Atividade deve ter descrição válida";
        }

        // Verificar se a atividade não está duplicada
        if ($activity->isDuplicate()) {
            $errors[] = "Atividade duplicada não pode ser registrada";
        }

        return $errors;
    }

    /**
     * Valida se uma entidade pode ser deletada
     */
    public static function validateEntityDeletion(string $entityType, int $entityId, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para deletar entidades";
        }

        // Verificar se o usuário tem permissão para deletar
        if (!$user->canDelete($entityType)) {
            $errors[] = "Usuário não tem permissão para deletar este tipo de entidade";
        }

        // Verificar se a entidade não tem dependências
        if (self::hasDependencies($entityType, $entityId)) {
            $errors[] = "Entidade não pode ser deletada pois tem dependências";
        }

        return $errors;
    }

    /**
     * Verifica se uma entidade tem dependências
     */
    private static function hasDependencies(string $entityType, int $entityId): bool
    {
        // Implementar lógica para verificar dependências
        // Por exemplo, verificar se um projeto tem tarefas, se um usuário tem projetos, etc.
        
        switch ($entityType) {
            case 'project':
                // Verificar se o projeto tem tarefas, membros, etc.
                return false; // Implementar lógica real
                
            case 'user':
                // Verificar se o usuário tem projetos, leads, etc.
                return false; // Implementar lógica real
                
            case 'lead':
                // Verificar se o lead tem conversões, etc.
                return false; // Implementar lógica real
                
            default:
                return false;
        }
    }

    /**
     * Valida se uma entidade pode ser atualizada
     */
    public static function validateEntityUpdate(string $entityType, int $entityId, array $changes, User $user): array
    {
        $errors = [];

        // Verificar se o usuário está ativo
        if (!$user->isActive()) {
            $errors[] = "Usuário deve estar ativo para atualizar entidades";
        }

        // Verificar se o usuário tem permissão para atualizar
        if (!$user->canUpdate($entityType)) {
            $errors[] = "Usuário não tem permissão para atualizar este tipo de entidade";
        }

        // Verificar se as mudanças são válidas
        if (empty($changes)) {
            $errors[] = "Nenhuma mudança válida foi fornecida";
        }

        // Verificar se as mudanças não violam regras de negócio
        if (self::violatesBusinessRules($entityType, $entityId, $changes)) {
            $errors[] = "Mudanças violam regras de negócio";
        }

        return $errors;
    }

    /**
     * Verifica se as mudanças violam regras de negócio
     */
    private static function violatesBusinessRules(string $entityType, int $entityId, array $changes): bool
    {
        // Implementar lógica para verificar se as mudanças violam regras de negócio
        // Por exemplo, verificar se mudar o status de um projeto para "concluído" é válido
        
        switch ($entityType) {
            case 'project':
                // Verificar se mudar status para "concluído" é válido
                if (isset($changes['status']) && $changes['status'] === 'completed') {
                    // Verificar se todas as tarefas estão concluídas
                    return false; // Implementar lógica real
                }
                break;
                
            case 'user':
                // Verificar se desativar usuário é válido
                if (isset($changes['status']) && $changes['status'] === 'inactive') {
                    // Verificar se usuário não tem projetos ativos
                    return false; // Implementar lógica real
                }
                break;
                
            default:
                return false;
        }

        return false;
    }
}