<?php

namespace App\Console\Commands;

use App\Services\RouteFixAutomation\RouteFixAutomator;
use App\Services\RouteFixAutomation\Fixers\ServiceProviderFixer;
use App\Services\RouteFixAutomation\Fixers\RepositoryInterfaceFixer;
use App\Services\RouteFixAutomation\Fixers\ConfigurationProblemFixer;
use App\Services\RouteFixAutomation\Fixers\MissingServiceFixer;
use App\Services\RouteFixAutomation\Testing\ControllerTester;
use App\Services\RouteFixAutomation\Logging\ProgressTracker;
use Illuminate\Console\Command;

class FixRoutesCommand extends Command
{
    protected $signature = 'routes:fix 
                            {--step= : Executar apenas uma fase específica (providers|interfaces|config|services)}
                            {--dry-run : Executar em modo simulação sem fazer mudanças}
                            {--report : Gerar apenas relatório de progresso}';

    protected $description = 'Automatizar correção de problemas nas rotas do xWin Dash';

    public function handle(): int
    {
        $this->info('🚀 AUTOMAÇÃO DE CORREÇÃO DAS ROTAS - xWin Dash');
        $this->info('📅 Iniciado em: ' . now()->format('Y-m-d H:i:s'));
        $this->newLine();

        try {
            // Inicializar dependências
            $controllerTester = new ControllerTester();
            $progressTracker = new ProgressTracker();
            
            $automator = new RouteFixAutomator(
                new ServiceProviderFixer(),
                new RepositoryInterfaceFixer($controllerTester),
                new ConfigurationProblemFixer($controllerTester),
                new MissingServiceFixer($controllerTester),
                $controllerTester,
                $progressTracker
            );

            $verbose = $this->getOutput()->isVerbose();
            $dryRun = $this->option('dry-run');
            $step = $this->option('step');
            $reportOnly = $this->option('report');

            if ($dryRun) {
                $this->warn('🧪 MODO SIMULAÇÃO - Nenhuma mudança será feita');
                $this->newLine();
            }

            // Apenas relatório
            if ($reportOnly) {
                return $this->generateReport($automator);
            }

            // Executar fase específica
            if ($step) {
                return $this->executeStep($automator, $step, $verbose, $dryRun);
            }

            // Executar pipeline completo
            return $this->executeFullPipeline($automator, $verbose, $dryRun);

        } catch (\Exception $e) {
            $this->error('❌ ERRO CRÍTICO: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            return 1;
        }
    }

    private function executeFullPipeline(RouteFixAutomator $automator, bool $verbose, bool $dryRun): int
    {
        $this->info('🔄 EXECUTANDO PIPELINE COMPLETO');
        $this->newLine();

        $result = $automator->executeFullPipeline($verbose, $dryRun);

        $this->displayResults($result);

        return $result->success ? 0 : 1;
    }

    private function executeStep(RouteFixAutomator $automator, string $step, bool $verbose, bool $dryRun): int
    {
        $stepNames = [
            'providers' => 'Service Providers',
            'interfaces' => 'Repository Interfaces',
            'config' => 'Configuration Problems',
            'services' => 'Missing Services'
        ];

        if (!isset($stepNames[$step])) {
            $this->error("❌ Fase '{$step}' não reconhecida");
            $this->info('Fases disponíveis: ' . implode(', ', array_keys($stepNames)));
            return 1;
        }

        $this->info("🔧 EXECUTANDO FASE: {$stepNames[$step]}");
        $this->newLine();

        $result = $automator->executeStep($step, $verbose, $dryRun);

        $this->displayResults($result);

        return $result->success ? 0 : 1;
    }

    private function generateReport(RouteFixAutomator $automator): int
    {
        $this->info('📊 GERANDO RELATÓRIO DE PROGRESSO');
        $this->newLine();

        $report = $automator->generateProgressReport();

        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Controllers Funcionais', "{$report->functionalControllers}/{$report->totalControllers}"],
                ['Taxa de Sucesso', "{$report->successPercentage}%"],
                ['Problemas Restantes', count($report->remainingIssues)],
                ['Histórico de Correções', count($report->fixHistory)]
            ]
        );

        if (!empty($report->remainingIssues)) {
            $this->newLine();
            $this->warn('⚠️  PROBLEMAS RESTANTES:');
            foreach (array_slice($report->remainingIssues, 0, 10) as $issue) {
                $this->line('  • ' . $issue);
            }
            
            if (count($report->remainingIssues) > 10) {
                $this->line('  • ... e mais ' . (count($report->remainingIssues) - 10) . ' problemas');
            }
        }

        return 0;
    }

    private function displayResults($result): void
    {
        $this->newLine();
        $this->info('📊 RESULTADOS DA EXECUÇÃO:');
        
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Status', $result->success ? '✅ Sucesso' : '❌ Com Erros'],
                ['Total de Correções', $result->totalFixed],
                ['Total de Erros', $result->totalErrors],
                ['Tempo de Execução', "{$result->executionTime}s"]
            ]
        );

        if (!empty($result->fixedItems)) {
            $this->newLine();
            $this->info('✅ CORREÇÕES APLICADAS:');
            foreach ($result->fixedItems as $item) {
                $this->line('  • ' . $item);
            }
        }

        if (!empty($result->errors)) {
            $this->newLine();
            $this->error('❌ ERROS ENCONTRADOS:');
            foreach ($result->errors as $error) {
                $this->line('  • ' . $error);
            }
        }

        if (isset($result->finalTest)) {
            $this->newLine();
            $this->info('🧪 TESTE FINAL:');
            $this->line("  • Controllers funcionais: {$result->finalTest->functionalControllers}/{$result->finalTest->totalControllers}");
            $this->line("  • Taxa de sucesso: {$result->finalTest->successPercentage}%");
        }

        $this->newLine();
        $this->info('🔄 PRÓXIMOS PASSOS:');
        $this->line('  • Execute: php artisan routes:fix --report');
        $this->line('  • Teste manualmente: php test_controllers.php');
        $this->line('  • Valide rotas: php artisan route:list');
    }
}