<?php

namespace App\Domains\Universe\Application\Services;

use App\Domains\Universe\Domain\UniverseInstance;
use App\Domains\Universe\Domain\UniverseTemplate;
use App\Domains\Users\Domain\User;
use Illuminate\Support\Facades\Log;

/**
 * Application Service para Universe (Refatorado)
 *
 * Orquestra serviços especializados e fornece interface unificada
 * para operações de instâncias, templates e relatórios do universo.
 *
 * Refatorado para reduzir complexidade e melhorar manutenibilidade.
 */
class UniverseApplicationService
{
    private UniverseInstanceService $instanceService;
    private UniverseTemplateService $templateService;
    private UniverseReportService $reportService;
    private UniverseConfigurationService $configurationService;

    public function __construct(
        UniverseInstanceService $instanceService,
        UniverseTemplateService $templateService,
        UniverseReportService $reportService,
        UniverseConfigurationService $configurationService
    ) {
        $this->instanceService = $instanceService;
        $this->templateService = $templateService;
        $this->reportService = $reportService;
        $this->configurationService = $configurationService;
    }

    // ===== INSTÂNCIAS DO UNIVERSO =====

    /**
     * Cria uma nova instância do universo
     */
    public function createUniverseInstance(array $data): array
    {
        return $this->instanceService->create($data);
    }

    /**
     * Atualiza uma instância do universo
     */
    public function updateUniverseInstance(int $instanceId, array $data): array
    {
        return $this->instanceService->update($instanceId, $data);
    }

    /**
     * Remove uma instância do universo
     */
    public function deleteUniverseInstance(int $instanceId, int $userId): array
    {
        return $this->instanceService->delete($instanceId, $userId);
    }

    /**
     * Obtém uma instância específica do universo
     */
    public function getUniverseInstance(int $instanceId, int $userId, array $options = []): array
    {
        return $this->instanceService->get($instanceId, $userId, $options);
    }

    /**
     * Lista instâncias do universo do usuário
     */
    public function listUniverseInstances(int $userId, array $filters = []): array
    {
        return $this->instanceService->list($userId, $filters);
    }

    /**
     * Compartilha uma instância do universo
     */
    public function shareUniverseInstance(array $data): array
    {
        return $this->instanceService->share($data);
    }

    // ===== TEMPLATES DO UNIVERSO =====

    /**
     * Cria um novo template do universo
     */
    public function createUniverseTemplate(array $data): array
    {
        return $this->templateService->create($data);
    }

    /**
     * Atualiza um template do universo
     */
    public function updateUniverseTemplate(int $templateId, array $data): array
    {
        return $this->templateService->update($templateId, $data);
    }

    /**
     * Remove um template do universo
     */
    public function deleteUniverseTemplate(int $templateId, int $userId): array
    {
        return $this->templateService->delete($templateId, $userId);
    }

    /**
     * Obtém um template específico do universo
     */
    public function getUniverseTemplate(int $templateId, int $userId, array $options = []): array
    {
        return $this->templateService->get($templateId, $userId, $options);
    }

    /**
     * Lista templates do universo do usuário
     */
    public function listUniverseTemplates(int $userId, array $filters = []): array
    {
        return $this->templateService->list($userId, $filters);
    }

    // ===== RELATÓRIOS DO UNIVERSO =====

    /**
     * Gera um relatório do universo
     */
    public function generateUniverseReport(array $data): array
    {
        return $this->reportService->generate($data);
    }

    // ===== MÉTODOS AUXILIARES =====

    /**
     * Obtém usuário por ID
     */
    public function getUserById(int $userId): ?User
    {
        try {
            return User::find($userId);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseApplicationService::getUserById', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);
            return null;
        }
    }

    /**
     * Obtém uma instância por ID (método auxiliar)
     */
    public function getUniverseInstanceById(int $instanceId): ?UniverseInstance
    {
        return $this->instanceService->getById($instanceId);
    }

    /**
     * Obtém uma instância por slug (método auxiliar)
     */
    public function getUniverseInstanceBySlug(string $slug, int $userId): ?UniverseInstance
    {
        return $this->instanceService->getBySlug($slug, $userId);
    }

    /**
     * Obtém um template por ID (método auxiliar)
     */
    public function getUniverseTemplateById(int $templateId): ?UniverseTemplate
    {
        return $this->templateService->getById($templateId);
    }

    /**
     * Obtém um template por slug (método auxiliar)
     */
    public function getUniverseTemplateBySlug(string $slug, int $userId): ?UniverseTemplate
    {
        return $this->templateService->getBySlug($slug, $userId);
    }

    /**
     * Obtém o papel do usuário em uma instância
     */
    public function getUserInstanceRole(int $instanceId, int $userId): ?string
    {
        return $this->instanceService->getUserRole($instanceId, $userId);
    }

    // ===== CONFIGURAÇÕES =====

    /**
     * Configura configurações iniciais de uma instância
     */
    public function configureInitialInstanceSettings(UniverseInstance $instance): void
    {
        $this->configurationService->configureInitialInstanceSettings($instance);
    }

    /**
     * Configura permissões padrão de uma instância
     */
    public function setupDefaultInstancePermissions(UniverseInstance $instance): void
    {
        $this->configurationService->setupDefaultInstancePermissions($instance);
    }

    /**
     * Configura analytics de uma instância
     */
    public function setupInstanceAnalytics(UniverseInstance $instance): void
    {
        $this->configurationService->setupInstanceAnalytics($instance);
    }

    /**
     * Configura notificações de uma instância
     */
    public function setupInstanceNotifications(UniverseInstance $instance): void
    {
        $this->configurationService->setupInstanceNotifications($instance);
    }

    /**
     * Configura integrações de uma instância
     */
    public function setupInstanceIntegrations(UniverseInstance $instance): void
    {
        $this->configurationService->setupInstanceIntegrations($instance);
    }

    /**
     * Configura webhooks de uma instância
     */
    public function setupInstanceWebhooks(UniverseInstance $instance): void
    {
        $this->configurationService->setupInstanceWebhooks($instance);
    }

    /**
     * Aplica template a uma instância
     */
    public function applyTemplateToInstance(UniverseInstance $instance): void
    {
        $this->configurationService->applyTemplateToInstance($instance);
    }

    /**
     * Configura configurações iniciais de um template
     */
    public function configureInitialTemplateSettings(UniverseTemplate $template): void
    {
        $this->configurationService->configureInitialTemplateSettings($template);
    }

    /**
     * Configura analytics de um template
     */
    public function setupTemplateAnalytics(UniverseTemplate $template): void
    {
        $this->configurationService->setupTemplateAnalytics($template);
    }

    /**
     * Configura notificações de um template
     */
    public function setupTemplateNotifications(UniverseTemplate $template): void
    {
        $this->configurationService->setupTemplateNotifications($template);
    }

    /**
     * Configura integrações de um template
     */
    public function setupTemplateIntegrations(UniverseTemplate $template): void
    {
        $this->configurationService->setupTemplateIntegrations($template);
    }

    /**
     * Configura webhooks de um template
     */
    public function setupTemplateWebhooks(UniverseTemplate $template): void
    {
        $this->configurationService->setupTemplateWebhooks($template);
    }

    /**
     * Aplica template pai a um template
     */
    public function applyParentTemplateToTemplate(UniverseTemplate $template): void
    {
        $this->configurationService->applyParentTemplateToTemplate($template);
    }

    /**
     * Configura versionamento de um template
     */
    public function setupTemplateVersioning(UniverseTemplate $template): void
    {
        $this->configurationService->setupTemplateVersioning($template);
    }

    // ===== MÉTRICAS E ESTATÍSTICAS =====

    /**
     * Conta instâncias ativas do usuário
     */
    public function getActiveInstancesCount(int $userId): int
    {
        return $this->instanceService->getActiveCount($userId);
    }

    /**
     * Obtém limite máximo de instâncias do usuário
     */
    public function getUserMaxActiveInstances(int $userId): int
    {
        return $this->instanceService->getUserMaxInstances($userId);
    }

    /**
     * Conta templates do usuário
     */
    public function getUserTemplatesCount(int $userId): int
    {
        return $this->templateService->getUserTemplatesCount($userId);
    }

    /**
     * Obtém limite máximo de templates do usuário
     */
    public function getUserMaxTemplates(int $userId): int
    {
        return $this->templateService->getUserMaxTemplates($userId);
    }

    /**
     * Conta relatórios diários do usuário
     */
    public function getDailyReportsCount(int $userId): int
    {
        return $this->reportService->getDailyReportsCount($userId);
    }

    /**
     * Obtém limite máximo de relatórios diários do usuário
     */
    public function getUserMaxDailyReports(int $userId): int
    {
        return $this->reportService->getUserMaxDailyReports($userId);
    }

    /**
     * Conta relatórios mensais do usuário
     */
    public function getMonthlyReportsCount(int $userId): int
    {
        return $this->reportService->getMonthlyReportsCount($userId);
    }

    /**
     * Obtém limite máximo de relatórios mensais do usuário
     */
    public function getUserMaxMonthlyReports(int $userId): int
    {
        return $this->reportService->getUserMaxMonthlyReports($userId);
    }

    /**
     * Obtém estatísticas gerais do sistema
     */
    public function getStats(): array
    {
        return $this->reportService->getStats();
    }
}
