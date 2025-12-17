<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RouteFixAutomation\RouteFixAutomator;

class RouteFixAutomatorCommand extends Command
{
    protected $signature = 'routes:fix-automation 
                           {--step= : Execute specific step (providers|interfaces|config|services|all)}
                           {--dry-run : Show what would be done without executing}';

    protected $description = 'Automatiza a correção de todos os problemas das rotas identificados';

    protected RouteFixAutomator $automator;

    public function __construct(RouteFixAutomator $automator)
    {
        parent::__construct();
        $this->automator = $automator;
    }

    public function handle(): int
    {
        $this->info('🚀 Iniciando Automação de Correção das Rotas');
        $this->info('==========================================');

        $step = $this->option('step') ?? 'all';
        $verbose = $this->getOutput()->isVerbose();
        $dryRun = $this->option('dry-run');

        try {
            if ($step === 'all') {
                $result = $this->automator->executeFullPipeline($verbose, $dryRun);
            } else {
                $result = $this->automator->executeStep($step, $verbose, $dryRun);
            }

            $this->displayResults($result);
            
            return $result->success ? 0 : 1;

        } catch (\Exception $e) {
            $this->error("❌ Erro durante execução: {$e->getMessage()}");
            if ($verbose) {
                $this->error($e->getTraceAsString());
            }
            return 1;
        }
    }

    private function displayResults($result): void
    {
        $this->info("\n📊 RESULTADOS:");
        $this->info("✅ Correções aplicadas: {$result->totalFixed}");
        $this->info("❌ Erros encontrados: {$result->totalErrors}");
        $this->info("⏱️ Tempo de execução: {$result->executionTime}s");

        if (!empty($result->fixedItems)) {
            $this->info("\n🔧 ITENS CORRIGIDOS:");
            foreach ($result->fixedItems as $item) {
                $this->line("  • {$item}");
            }
        }

        if (!empty($result->errors)) {
            $this->error("\n🚨 ERROS:");
            foreach ($result->errors as $error) {
                $this->error("  • {$error}");
            }
        }
    }
}