<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Domain\UniverseInstance;
use App\Domains\Universe\Application\Commands\GenerateUniverseReportCommand;
use App\Domains\Universe\Application\Handlers\GenerateUniverseReportHandler;
use App\Domains\Universe\Application\Services\UniverseApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\UniverseReportGeneratedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para geração de relatórios do universo
 *
 * Orquestra a geração de um relatório do universo,
 * incluindo validações, processamento e eventos.
 */
class GenerateUniverseReportUseCase
{
    private GenerateUniverseReportHandler $handler;
    private UniverseApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        GenerateUniverseReportHandler $handler,
        UniverseApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de geração de relatório do universo
     */
    public function execute(GenerateUniverseReportCommand $command): array
    {
        try {
            Log::info('Starting universe report generation use case', [
                'instance_id' => $command->getInstanceId(),
                'user_id' => $command->getUserId(),
                'report_type' => $command->getReportType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do relatório inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Buscar instância
                $instance = $this->applicationService->getUniverseInstanceById($command->getInstanceId());
                if (!$instance) {
                    return [
                        'success' => false,
                        'errors' => ['Instância do universo não encontrada'],
                        'message' => 'Instância do universo não encontrada'
                    ];
                }

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateUniverseReportGeneration($instance, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar geração do relatório
                $result = $this->handler->handle($command);

                // Executar ações pós-geração
                $this->executePostGenerationActions($instance, $command, $result);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($instance, $command, $result);

                Log::info('Universe report generated successfully', [
                    'instance_id' => $instance->getId(),
                    'user_id' => $command->getUserId(),
                    'report_type' => $command->getReportType(),
                    'report_id' => $result['report_id'] ?? null
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'instance_id' => $instance->getId(),
                        'report_id' => $result['report_id'] ?? null,
                        'report_type' => $command->getReportType(),
                        'report_url' => $result['report_url'] ?? null,
                        'generated_at' => now()->toISOString(),
                        'status' => 'generated'
                    ],
                    'message' => 'Relatório do universo gerado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in GenerateUniverseReportUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'instance_id' => $command->getInstanceId(),
                'user_id' => $command->getUserId()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante geração do relatório'],
                'message' => 'Falha ao gerar relatório do universo'
            ];
        }
    }

    /**
     * Valida o comando de geração
     */
    private function validateCommand(GenerateUniverseReportCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if ($command->getInstanceId() <= 0) {
            $errors[] = 'ID da instância é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($command->getReportType())) {
            $errors[] = 'Tipo do relatório é obrigatório';
        }

        // Validar tipo de relatório
        $validReportTypes = ['summary', 'detailed', 'analytics', 'performance', 'usage', 'custom'];
        if (!in_array($command->getReportType(), $validReportTypes)) {
            $errors[] = 'Tipo de relatório inválido';
        }

        // Validar formato
        $validFormats = ['pdf', 'excel', 'csv', 'json', 'html'];
        if ($command->getFormat() && !in_array($command->getFormat(), $validFormats)) {
            $errors[] = 'Formato inválido';
        }

        // Validar período
        if ($command->getStartDate() && $command->getEndDate() && $command->getStartDate() > $command->getEndDate()) {
            $errors[] = 'Data de início não pode ser posterior à data de fim';
        }

        // Validar opções
        if ($command->getOptions() && !is_array($command->getOptions())) {
            $errors[] = 'Opções devem ser um array';
        }

        return $errors;
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(UniverseInstance $instance, int $userId): array
    {
        try {
            // Verificar se a instância pertence ao usuário
            if ($instance->getUserId() !== $userId) {
                return ['Instância do universo não pertence ao usuário'];
            }

            // Verificar se a instância pode gerar relatórios
            if (!$instance->canGenerateReports()) {
                return ['Instância do universo não pode gerar relatórios no status atual'];
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar permissões
            $permissionErrors = $this->validatePermissions($instance, $userId);
            if (!empty($permissionErrors)) {
                return $permissionErrors;
            }

            // Validação bem-sucedida
            return [
                'valid' => true,
                'message' => 'Cross-module validation passed',
                'instance_id' => $instance->getId(),
                'user_id' => $userId,
                'validated_at' => now()->toISOString()
            ];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for universe report generation', [
                'error' => $exception->getMessage(),
                'instance_id' => $instance->getId(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida limites do usuário
     */
    private function validateUserLimits(int $userId): array
    {
        $errors = [];

        // Verificar limite de relatórios diários
        $dailyReportsCount = $this->applicationService->getDailyReportsCount($userId);
        $maxDailyReports = $this->applicationService->getUserMaxDailyReports($userId);

        if ($dailyReportsCount >= $maxDailyReports) {
            $errors[] = "Usuário excedeu o limite de relatórios diários ({$maxDailyReports})";
        }

        // Verificar limite de relatórios mensais
        $monthlyReportsCount = $this->applicationService->getMonthlyReportsCount($userId);
        $maxMonthlyReports = $this->applicationService->getUserMaxMonthlyReports($userId);

        if ($monthlyReportsCount >= $maxMonthlyReports) {
            $errors[] = "Usuário excedeu o limite de relatórios mensais ({$maxMonthlyReports})";
        }

        return $errors;
    }

    /**
     * Valida permissões
     */
    private function validatePermissions(UniverseInstance $instance, int $userId): array
    {
        $errors = [];

        // Verificar se o usuário tem permissão para gerar relatórios
        $userRole = $this->applicationService->getUserInstanceRole($instance->getId(), $userId);

        if (!$userRole) {
            return ['Usuário não tem acesso à instância'];
        }

        // Verificar se o usuário pode gerar o tipo específico de relatório
        $allowedReportTypes = $this->getAllowedReportTypesForUser($userRole);
        if (!in_array($userRole, $allowedReportTypes)) {
            $errors[] = "Usuário não tem permissão para gerar relatórios do tipo '{$userRole}'";
        }

        return $errors;
    }

    /**
     * Obtém tipos de relatório permitidos para o usuário
     */
    private function getAllowedReportTypesForUser(string $userRole): array
    {
        $rolePermissions = [
            'owner' => ['summary', 'detailed', 'analytics', 'performance', 'usage', 'custom'],
            'admin' => ['summary', 'detailed', 'analytics', 'performance', 'usage'],
            'member' => ['summary', 'analytics', 'usage'],
            'viewer' => ['summary']
        ];

        return $rolePermissions[$userRole] ?? [];
    }

    /**
     * Executa ações pós-geração
     */
    private function executePostGenerationActions(UniverseInstance $instance, GenerateUniverseReportCommand $command, array $result): void
    {
        try {
            // Configurar analytics pós-geração
            $this->applicationService->setupReportGenerationAnalytics($instance, $result);

            // Configurar notificações
            $this->applicationService->setupReportGenerationNotifications($instance, $result);

            // Configurar integrações
            $this->applicationService->setupReportGenerationIntegrations($instance, $result);

            // Configurar webhooks
            $this->applicationService->setupReportGenerationWebhooks($instance, $result);

            // Atualizar estatísticas
            $this->applicationService->updateReportGenerationStats($instance, $result);

            // Configurar armazenamento
            $this->applicationService->setupReportStorage($instance, $result);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-generation actions', [
                'error' => $exception->getMessage(),
                'instance_id' => $instance->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(UniverseInstance $instance, GenerateUniverseReportCommand $command, array $result): void
    {
        try {
            $event = new UniverseReportGeneratedEvent(
                instanceId: $instance->getId(),
                instanceName: $instance->getName(),
                userId: $command->getUserId(),
                projectId: $instance->getProjectId(),
                reportType: $command->getReportType(),
                metadata: [
                    'report_id' => $result['report_id'] ?? null,
                    'report_url' => $result['report_url'] ?? null,
                    'format' => $command->getFormat(),
                    'start_date' => $command->getStartDate()?->format('Y-m-d H:i:s'),
                    'end_date' => $command->getEndDate()?->format('Y-m-d H:i:s'),
                    'source' => 'use_case',
                    'generated_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching universe report generated event', [
                'error' => $exception->getMessage(),
                'instance_id' => $instance->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'GenerateUniverseReportUseCase',
            'description' => 'Geração de relatórios do universo',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
