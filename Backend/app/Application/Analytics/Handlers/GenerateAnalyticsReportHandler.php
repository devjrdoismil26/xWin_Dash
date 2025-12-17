<?php

namespace App\Application\Analytics\Handlers;

use App\Application\Analytics\Commands\GenerateAnalyticsReportCommand;
use App\Application\Analytics\UseCases\GenerateAnalyticsReportUseCase;
use App\Shared\Exceptions\BusinessRuleException;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/**
 * Handler para o comando GenerateAnalyticsReportCommand
 * Implementa validações de relatórios e otimizações de performance
 */
class GenerateAnalyticsReportHandler
{
    private GenerateAnalyticsReportUseCase $generateAnalyticsReportUseCase;
    private CrossModuleValidationService $validationService;

    public function __construct(
        GenerateAnalyticsReportUseCase $generateAnalyticsReportUseCase,
        CrossModuleValidationService $validationService
    ) {
        $this->generateAnalyticsReportUseCase = $generateAnalyticsReportUseCase;
        $this->validationService = $validationService;
    }

    /**
     * Manipula o comando de geração de relatório de analytics
     *
     * @param GenerateAnalyticsReportCommand $command
     * @return array
     * @throws BusinessRuleException
     */
    public function handle(GenerateAnalyticsReportCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Validações de negócio
            $this->validateBusinessRules($command);

            // 2. Verificar cache
            $cachedReport = $this->checkCache($command);
            if ($cachedReport) {
                Log::info("Relatório de analytics servido do cache", [
                    'report_type' => $command->reportType,
                    'user_id' => $command->userId
                ]);
                return $cachedReport;
            }

            // 3. Validar permissões
            $this->validatePermissions($command);

            // 4. Aplicar regras de negócio
            $this->applyBusinessRules($command);

            // 5. Executar caso de uso
            $report = $this->generateAnalyticsReportUseCase->execute($command);

            // 6. Pós-processamento
            $this->postProcessReport($report, $command);

            // 7. Cachear resultado
            $this->cacheReport($report, $command);

            DB::commit();

            Log::info("Relatório de analytics gerado com sucesso via Handler", [
                'report_id' => $report->id,
                'report_type' => $command->reportType,
                'user_id' => $command->userId,
                'date_range' => "{$command->startDate} - {$command->endDate}"
            ]);

            return [
                'success' => true,
                'report' => $report,
                'message' => 'Relatório gerado com sucesso',
                'cached' => false
            ];

        } catch (BusinessRuleException $e) {
            DB::rollBack();
            Log::warning("Falha na geração de relatório - Regra de negócio", [
                'report_type' => $command->reportType,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);
            throw $e;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro inesperado na geração de relatório", [
                'report_type' => $command->reportType,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new BusinessRuleException("Erro interno na geração de relatório: " . $e->getMessage());
        }
    }

    /**
     * Valida regras de negócio básicas
     */
    private function validateBusinessRules(GenerateAnalyticsReportCommand $command): void
    {
        // Validar tipo de relatório
        $validTypes = [
            'traffic', 'conversions', 'revenue', 'ads_performance',
            'social_media', 'email_marketing', 'custom', 'dashboard'
        ];
        if (!in_array($command->reportType, $validTypes)) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                "Tipo de relatório inválido: {$command->reportType}"
            );
        }

        // Validar datas
        $startDate = new \DateTime($command->startDate);
        $endDate = new \DateTime($command->endDate);
        $now = new \DateTime();

        if ($startDate > $endDate) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Data de início não pode ser posterior à data de fim'
            );
        }

        if ($startDate > $now) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Data de início não pode ser no futuro'
            );
        }

        // Validar intervalo máximo
        $diff = $startDate->diff($endDate);
        $maxDays = $command->reportType === 'dashboard' ? 30 : 365;
        if ($diff->days > $maxDays) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                "Intervalo máximo permitido: {$maxDays} dias"
            );
        }

        // Validar usuário
        if (!$command->userId) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'ID do usuário é obrigatório'
            );
        }

        $user = $this->validationService->findUserById($command->userId);
        if (!$user) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Usuário não encontrado'
            );
        }

        // Validar filtros
        if ($command->filters && !is_array($command->filters)) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Filtros devem ser um array'
            );
        }
    }

    /**
     * Verifica se o relatório está em cache
     */
    private function checkCache(GenerateAnalyticsReportCommand $command): ?array
    {
        $cacheKey = $this->generateCacheKey($command);
        $cached = Cache::get($cacheKey);

        if ($cached) {
            // Verificar se o cache ainda é válido
            $cacheAge = now()->diffInMinutes($cached['generated_at']);
            $maxCacheAge = $this->getMaxCacheAge($command->reportType);

            if ($cacheAge <= $maxCacheAge) {
                return [
                    'success' => true,
                    'report' => $cached['report'],
                    'message' => 'Relatório servido do cache',
                    'cached' => true,
                    'cache_age_minutes' => $cacheAge
                ];
            }
        }

        return null;
    }

    /**
     * Gera chave de cache para o relatório
     */
    private function generateCacheKey(GenerateAnalyticsReportCommand $command): string
    {
        $filtersHash = $command->filters ? md5(serialize($command->filters)) : 'no-filters';
        return "analytics_report:{$command->reportType}:{$command->startDate}:{$command->endDate}:{$command->userId}:{$filtersHash}";
    }

    /**
     * Retorna idade máxima do cache por tipo de relatório
     */
    private function getMaxCacheAge(string $reportType): int
    {
        $cacheAges = [
            'dashboard' => 15,      // 15 minutos
            'traffic' => 30,        // 30 minutos
            'conversions' => 60,    // 1 hora
            'revenue' => 120,       // 2 horas
            'ads_performance' => 30, // 30 minutos
            'social_media' => 60,   // 1 hora
            'email_marketing' => 60, // 1 hora
            'custom' => 240,        // 4 horas
        ];

        return $cacheAges[$reportType] ?? 60;
    }

    /**
     * Valida permissões do usuário
     */
    private function validatePermissions(GenerateAnalyticsReportCommand $command): void
    {
        $user = auth()->user();
        if (!$user) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Usuário não autenticado'
            );
        }

        // Verificar se o usuário pode gerar relatórios
        if (!$user->hasPermission('analytics.reports.generate')) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Usuário não tem permissão para gerar relatórios'
            );
        }

        // Verificar se está gerando para si mesmo ou se é admin
        if ($command->userId !== $user->id && !$user->hasRole(['admin', 'analyst'])) {
            throw BusinessRuleException::operationNotAllowed(
                'generate_analytics_report',
                'Usuário só pode gerar relatórios para si mesmo'
            );
        }

        // Verificar limites de geração
        $this->validateGenerationLimits($user, $command);
    }

    /**
     * Valida limites de geração de relatórios
     */
    private function validateGenerationLimits($user, GenerateAnalyticsReportCommand $command): void
    {
        $today = now()->format('Y-m-d');
        $cacheKey = "user_report_generation:{$user->id}:{$today}";
        $todayCount = Cache::get($cacheKey, 0);

        $maxReportsPerDay = $user->hasRole('premium') ? 100 : 20;
        if ($todayCount >= $maxReportsPerDay) {
            throw BusinessRuleException::resourceLimit(
                'relatórios por dia',
                $maxReportsPerDay
            );
        }

        // Incrementar contador
        Cache::put($cacheKey, $todayCount + 1, now()->endOfDay());
    }

    /**
     * Aplica regras de negócio
     */
    private function applyBusinessRules(GenerateAnalyticsReportCommand $command): void
    {
        // Normalizar datas
        $command->startDate = (new \DateTime($command->startDate))->format('Y-m-d');
        $command->endDate = (new \DateTime($command->endDate))->format('Y-m-d');

        // Aplicar filtros padrão se não fornecidos
        if (!$command->filters) {
            $command->filters = $this->getDefaultFilters($command->reportType);
        }

        // Adicionar metadados
        $command->metadata = [
            'generated_by' => auth()->id(),
            'generated_at' => now(),
            'report_version' => '1.0',
            'data_sources' => $this->getDataSources($command->reportType),
            'complexity_score' => $this->calculateComplexityScore($command)
        ];
    }

    /**
     * Retorna filtros padrão por tipo de relatório
     */
    private function getDefaultFilters(string $reportType): array
    {
        $defaultFilters = [
            'traffic' => ['include_bots' => false, 'group_by' => 'day'],
            'conversions' => ['include_failed' => false, 'group_by' => 'day'],
            'revenue' => ['currency' => 'BRL', 'group_by' => 'day'],
            'ads_performance' => ['platforms' => 'all', 'group_by' => 'campaign'],
            'social_media' => ['platforms' => 'all', 'group_by' => 'day'],
            'email_marketing' => ['include_unsubscribed' => false, 'group_by' => 'campaign'],
            'custom' => ['group_by' => 'day'],
            'dashboard' => ['include_trends' => true, 'group_by' => 'day']
        ];

        return $defaultFilters[$reportType] ?? [];
    }

    /**
     * Retorna fontes de dados por tipo de relatório
     */
    private function getDataSources(string $reportType): array
    {
        $dataSources = [
            'traffic' => ['analytics', 'website_logs'],
            'conversions' => ['analytics', 'leads', 'sales'],
            'revenue' => ['sales', 'payments', 'analytics'],
            'ads_performance' => ['google_ads', 'facebook_ads', 'analytics'],
            'social_media' => ['facebook', 'instagram', 'twitter', 'linkedin'],
            'email_marketing' => ['email_service', 'analytics'],
            'custom' => ['all'],
            'dashboard' => ['analytics', 'leads', 'sales', 'social_media']
        ];

        return $dataSources[$reportType] ?? ['analytics'];
    }

    /**
     * Calcula score de complexidade do relatório
     */
    private function calculateComplexityScore(GenerateAnalyticsReportCommand $command): int
    {
        $score = 0;

        // Pontos por tipo de relatório
        $typeScores = [
            'dashboard' => 20,
            'traffic' => 10,
            'conversions' => 15,
            'revenue' => 25,
            'ads_performance' => 30,
            'social_media' => 20,
            'email_marketing' => 15,
            'custom' => 40
        ];
        $score += $typeScores[$command->reportType] ?? 10;

        // Pontos por intervalo de datas
        $startDate = new \DateTime($command->startDate);
        $endDate = new \DateTime($command->endDate);
        $days = $startDate->diff($endDate)->days;
        $score += min($days / 10, 20); // Máximo 20 pontos

        // Pontos por filtros
        if ($command->filters) {
            $score += count($command->filters) * 2;
        }

        return (int) $score;
    }

    /**
     * Pós-processamento do relatório gerado
     */
    private function postProcessReport($report, GenerateAnalyticsReportCommand $command): void
    {
        // Registrar atividade
        $this->validationService->recordAnalyticsActivity($report->id, [
            'type' => 'report_generated',
            'description' => "Relatório {$command->reportType} gerado",
            'metadata' => [
                'report_type' => $command->reportType,
                'date_range' => "{$command->startDate} - {$command->endDate}",
                'complexity_score' => $command->metadata['complexity_score'],
                'data_sources' => $command->metadata['data_sources']
            ]
        ]);

        // Aplicar formatação específica
        $this->validationService->formatReportData($report, $command->reportType);

        // Notificar se relatório complexo
        if ($command->metadata['complexity_score'] > 30) {
            $this->validationService->notifyComplexReportGenerated($report);
        }

        // Atualizar estatísticas de uso
        $this->validationService->updateReportUsageStats($command->reportType, $command->userId);
    }

    /**
     * Cacheia o resultado do relatório
     */
    private function cacheReport($report, GenerateAnalyticsReportCommand $command): void
    {
        $cacheKey = $this->generateCacheKey($command);
        $cacheData = [
            'report' => $report,
            'generated_at' => now(),
            'metadata' => $command->metadata
        ];

        $cacheDuration = $this->getMaxCacheAge($command->reportType);
        Cache::put($cacheKey, $cacheData, now()->addMinutes($cacheDuration));

        Log::info("Relatório de analytics cacheado", [
            'cache_key' => $cacheKey,
            'cache_duration_minutes' => $cacheDuration
        ]);
    }
}