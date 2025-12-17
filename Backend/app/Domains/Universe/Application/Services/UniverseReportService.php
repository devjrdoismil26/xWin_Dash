<?php

namespace App\Domains\Universe\Application\Services;

use App\Domains\Universe\Application\UseCases\GenerateUniverseReportUseCase;
use App\Domains\Universe\Application\Commands\GenerateUniverseReportCommand;
use App\Domains\Universe\Domain\UniverseInstance;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para operações de relatórios do universo
 *
 * Responsável por gerar e gerenciar relatórios do universo,
 * incluindo analytics e métricas.
 */
class UniverseReportService
{
    private GenerateUniverseReportUseCase $generateReportUseCase;

    public function __construct(
        GenerateUniverseReportUseCase $generateReportUseCase
    ) {
        $this->generateReportUseCase = $generateReportUseCase;
    }

    /**
     * Gera um relatório do universo
     */
    public function generate(array $data): array
    {
        try {
            $command = GenerateUniverseReportCommand::fromArray($data);
            return $this->generateReportUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseReportService::generate', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante geração do relatório'],
                'message' => 'Falha ao gerar relatório do universo'
            ];
        }
    }

    /**
     * Conta relatórios diários do usuário
     */
    public function getDailyReportsCount(int $userId): int
    {
        $cacheKey = "universe_daily_reports_count_{$userId}_" . date('Y-m-d');

        return Cache::remember($cacheKey, 300, function () use ($userId) {
            return \App\Domains\Universe\Models\UniverseReport::where('user_id', $userId)
                ->whereDate('created_at', today())
                ->count();
        });
    }

    /**
     * Obtém limite máximo de relatórios diários do usuário
     */
    public function getUserMaxDailyReports(int $userId): int
    {
        $user = \App\Domains\Users\Domain\User::find($userId);

        if (!$user) {
            return 0;
        }

        // Lógica baseada no plano do usuário
        return match ($user->plan) {
            'free' => 5,
            'basic' => 20,
            'premium' => 100,
            'enterprise' => 500,
            default => 5
        };
    }

    /**
     * Conta relatórios mensais do usuário
     */
    public function getMonthlyReportsCount(int $userId): int
    {
        $cacheKey = "universe_monthly_reports_count_{$userId}_" . date('Y-m');

        return Cache::remember($cacheKey, 300, function () use ($userId) {
            return \App\Domains\Universe\Models\UniverseReport::where('user_id', $userId)
                ->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'))
                ->count();
        });
    }

    /**
     * Obtém limite máximo de relatórios mensais do usuário
     */
    public function getUserMaxMonthlyReports(int $userId): int
    {
        $user = \App\Domains\Users\Domain\User::find($userId);

        if (!$user) {
            return 0;
        }

        // Lógica baseada no plano do usuário
        return match ($user->plan) {
            'free' => 50,
            'basic' => 200,
            'premium' => 1000,
            'enterprise' => 5000,
            default => 50
        };
    }

    /**
     * Obtém estatísticas gerais do sistema
     */
    public function getStats(): array
    {
        $cacheKey = "universe_system_stats";

        return Cache::remember($cacheKey, 600, function () {
            return [
                'total_instances' => \App\Domains\Universe\Models\UniverseInstance::count(),
                'total_templates' => \App\Domains\Universe\Models\UniverseTemplate::count(),
                'total_reports' => \App\Domains\Universe\Models\UniverseReport::count(),
                'active_instances' => \App\Domains\Universe\Models\UniverseInstance::where('status', 'active')->count(),
                'active_templates' => \App\Domains\Universe\Models\UniverseTemplate::where('status', 'active')->count(),
                'reports_today' => \App\Domains\Universe\Models\UniverseReport::whereDate('created_at', today())->count(),
                'reports_this_month' => \App\Domains\Universe\Models\UniverseReport::whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', date('m'))
                    ->count()
            ];
        });
    }
}
