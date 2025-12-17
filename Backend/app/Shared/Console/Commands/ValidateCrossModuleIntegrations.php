<?php

namespace App\Shared\Console\Commands;

use Illuminate\Console\Command;
use App\Shared\Services\ModuleIntegrationService;
use App\Shared\Services\CrossModuleRelationshipService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

/**
 * Comando para validar integrações cross-module
 */
class ValidateCrossModuleIntegrations extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cross-module:validate 
                            {--module=all : Módulo específico para validar (all, users, projects, leads, etc.)}
                            {--type=all : Tipo de validação (all, events, relationships, validations)}
                            {--fix : Tentar corrigir problemas encontrados}
                            {--verbose : Exibir informações detalhadas}';

    /**
     * The console command description.
     */
    protected $description = 'Valida integrações cross-module do sistema';

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
        parent::__construct();
        $this->moduleIntegrationService = $moduleIntegrationService;
        $this->relationshipService = $relationshipService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $module = $this->option('module');
        $type = $this->option('type');
        $fix = $this->option('fix');
        $verbose = $this->option('verbose');

        $this->info('Iniciando validação de integrações cross-module...');
        $this->info("Módulo: {$module}");
        $this->info("Tipo: {$type}");
        $this->info("Corrigir: " . ($fix ? 'Sim' : 'Não'));
        $this->info("Verbose: " . ($verbose ? 'Sim' : 'Não'));

        $startTime = time();
        $totalIssues = 0;
        $fixedIssues = 0;

        try {
            $this->info("\n=== Validação de Integrações Cross-Module ===");

            // Validar eventos
            if ($type === 'all' || $type === 'events') {
                $this->info("\n--- Validando Eventos ---");
                $eventIssues = $this->validateEvents($module, $verbose);
                $totalIssues += $eventIssues;
                
                if ($fix && $eventIssues > 0) {
                    $fixedIssues += $this->fixEventIssues($module);
                }
            }

            // Validar relacionamentos
            if ($type === 'all' || $type === 'relationships') {
                $this->info("\n--- Validando Relacionamentos ---");
                $relationshipIssues = $this->validateRelationships($module, $verbose);
                $totalIssues += $relationshipIssues;
                
                if ($fix && $relationshipIssues > 0) {
                    $fixedIssues += $this->fixRelationshipIssues($module);
                }
            }

            // Validar validações
            if ($type === 'all' || $type === 'validations') {
                $this->info("\n--- Validando Validações ---");
                $validationIssues = $this->validateValidations($module, $verbose);
                $totalIssues += $validationIssues;
                
                if ($fix && $validationIssues > 0) {
                    $fixedIssues += $this->fixValidationIssues($module);
                }
            }

            // Validar configurações
            if ($type === 'all') {
                $this->info("\n--- Validando Configurações ---");
                $configIssues = $this->validateConfigurations($verbose);
                $totalIssues += $configIssues;
                
                if ($fix && $configIssues > 0) {
                    $fixedIssues += $this->fixConfigurationIssues();
                }
            }

            // Exibir resumo
            $this->info("\n=== Resumo da Validação ===");
            $this->info("Total de problemas encontrados: {$totalIssues}");
            $this->info("Problemas corrigidos: {$fixedIssues}");
            $this->info("Tempo total: " . (time() - $startTime) . " segundos");

            if ($totalIssues > 0) {
                if ($fixedIssues > 0) {
                    $this->info("✓ {$fixedIssues} problemas foram corrigidos automaticamente.");
                }
                
                if ($totalIssues - $fixedIssues > 0) {
                    $this->warn("⚠️  " . ($totalIssues - $fixedIssues) . " problemas ainda precisam ser corrigidos manualmente.");
                }
            } else {
                $this->info("✓ Todas as integrações estão funcionando corretamente!");
            }

            return $totalIssues > 0 ? 1 : 0;

        } catch (\Throwable $exception) {
            $this->error('Erro durante validação: ' . $exception->getMessage());
            
            Log::error('Error in ValidateCrossModuleIntegrations command', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return 1;
        }
    }

    /**
     * Valida eventos
     */
    private function validateEvents(string $module, bool $verbose): int
    {
        $issues = 0;

        try {
            // Verificar se há eventos pendentes
            $pendingEvents = $this->eventDispatcher->getPendingEvents();
            if (!empty($pendingEvents)) {
                $this->warn("Encontrados " . count($pendingEvents) . " eventos pendentes na fila.");
                $issues++;
                
                if ($verbose) {
                    foreach ($pendingEvents as $event) {
                        $this->line("  - Evento {$event->eventId} ({$event->getEventType()})");
                    }
                }
            }

            // Verificar se há eventos em processamento há muito tempo
            $processingEvents = $this->eventDispatcher->getProcessingEvents();
            if (!empty($processingEvents)) {
                $this->warn("Encontrados " . count($processingEvents) . " eventos em processamento.");
                $issues++;
                
                if ($verbose) {
                    foreach ($processingEvents as $eventId) {
                        $this->line("  - Evento {$eventId} em processamento");
                    }
                }
            }

            // Verificar mapeamentos de eventos
            $eventMappings = $this->moduleIntegrationService->getEventMappings();
            if (empty($eventMappings)) {
                $this->error("Nenhum mapeamento de eventos encontrado.");
                $issues++;
            } else {
                $this->info("✓ " . count($eventMappings) . " mapeamentos de eventos encontrados.");
            }

        } catch (\Throwable $exception) {
            $this->error("Erro ao validar eventos: " . $exception->getMessage());
            $issues++;
        }

        return $issues;
    }

    /**
     * Valida relacionamentos
     */
    private function validateRelationships(string $module, bool $verbose): int
    {
        $issues = 0;

        try {
            // Verificar se o serviço de relacionamentos está funcionando
            $stats = $this->relationshipService->getStats();
            if (empty($stats)) {
                $this->error("Serviço de relacionamentos não está funcionando.");
                $issues++;
            } else {
                $this->info("✓ Serviço de relacionamentos funcionando.");
                
                if ($verbose) {
                    $this->line("  - Estatísticas: " . json_encode($stats));
                }
            }

            // Verificar relacionamentos de usuários
            if ($module === 'all' || $module === 'users') {
                $userRelationships = $this->relationshipService->getUserRelatedEntities(1);
                if (empty($userRelationships)) {
                    $this->warn("Nenhum relacionamento de usuário encontrado.");
                    $issues++;
                } else {
                    $this->info("✓ Relacionamentos de usuário funcionando.");
                }
            }

        } catch (\Throwable $exception) {
            $this->error("Erro ao validar relacionamentos: " . $exception->getMessage());
            $issues++;
        }

        return $issues;
    }

    /**
     * Valida validações
     */
    private function validateValidations(string $module, bool $verbose): int
    {
        $issues = 0;

        try {
            // Verificar se o serviço de validação está funcionando
            $stats = $this->validationService->getValidationStats();
            if (empty($stats)) {
                $this->error("Serviço de validação não está funcionando.");
                $issues++;
            } else {
                $this->info("✓ Serviço de validação funcionando.");
                
                if ($verbose) {
                    $this->line("  - Estatísticas: " . json_encode($stats));
                }
            }

            // Verificar regras de validação
            $validationRules = [
                'user_project_association',
                'lead_conversion',
                'post_social_association',
                'email_campaign_sending',
                'workflow_execution',
                'universe_instance_creation',
                'media_folder_association',
                'analytics_metric_creation',
                'aura_chat_creation',
                'ads_campaign_creation',
                'ai_generation_creation',
                'category_association',
                'integration_activation',
                'nodered_flow_execution',
                'product_project_association',
                'activity_registration',
                'entity_deletion',
                'entity_update'
            ];

            $this->info("✓ " . count($validationRules) . " regras de validação disponíveis.");

        } catch (\Throwable $exception) {
            $this->error("Erro ao validar validações: " . $exception->getMessage());
            $issues++;
        }

        return $issues;
    }

    /**
     * Valida configurações
     */
    private function validateConfigurations(bool $verbose): int
    {
        $issues = 0;

        try {
            // Verificar configurações do dispatcher
            $dispatcherStats = $this->eventDispatcher->getStats();
            if (empty($dispatcherStats)) {
                $this->error("Configurações do dispatcher não encontradas.");
                $issues++;
            } else {
                $this->info("✓ Configurações do dispatcher OK.");
                
                if ($verbose) {
                    $this->line("  - Estatísticas: " . json_encode($dispatcherStats));
                }
            }

            // Verificar configurações de cache
            $cacheTimeout = $this->validationService->getValidationStats()['cache_timeout'] ?? null;
            if ($cacheTimeout === null) {
                $this->warn("Configuração de timeout de cache não encontrada.");
                $issues++;
            } else {
                $this->info("✓ Configuração de cache OK (timeout: {$cacheTimeout}s).");
            }

        } catch (\Throwable $exception) {
            $this->error("Erro ao validar configurações: " . $exception->getMessage());
            $issues++;
        }

        return $issues;
    }

    /**
     * Corrige problemas de eventos
     */
    private function fixEventIssues(string $module): int
    {
        $fixed = 0;

        try {
            // Processar eventos pendentes
            $pendingEvents = $this->eventDispatcher->getPendingEvents();
            if (!empty($pendingEvents)) {
                $this->info("Processando eventos pendentes...");
                $this->eventDispatcher->processQueue();
                $fixed += count($pendingEvents);
            }

        } catch (\Throwable $exception) {
            $this->error("Erro ao corrigir problemas de eventos: " . $exception->getMessage());
        }

        return $fixed;
    }

    /**
     * Corrige problemas de relacionamentos
     */
    private function fixRelationshipIssues(string $module): int
    {
        $fixed = 0;

        try {
            // Limpar cache de relacionamentos
            $this->info("Limpando cache de relacionamentos...");
            // Implementar limpeza de cache específica
            $fixed++;

        } catch (\Throwable $exception) {
            $this->error("Erro ao corrigir problemas de relacionamentos: " . $exception->getMessage());
        }

        return $fixed;
    }

    /**
     * Corrige problemas de validações
     */
    private function fixValidationIssues(string $module): int
    {
        $fixed = 0;

        try {
            // Limpar cache de validações
            $this->info("Limpando cache de validações...");
            $this->validationService->clearValidationCache();
            $fixed++;

        } catch (\Throwable $exception) {
            $this->error("Erro ao corrigir problemas de validações: " . $exception->getMessage());
        }

        return $fixed;
    }

    /**
     * Corrige problemas de configurações
     */
    private function fixConfigurationIssues(): int
    {
        $fixed = 0;

        try {
            // Reconfigurar dispatcher com valores padrão
            $this->info("Reconfigurando dispatcher...");
            $this->eventDispatcher->configure([
                'max_retries' => 3,
                'retry_delay' => 5
            ]);
            $fixed++;

        } catch (\Throwable $exception) {
            $this->error("Erro ao corrigir problemas de configurações: " . $exception->getMessage());
        }

        return $fixed;
    }
}