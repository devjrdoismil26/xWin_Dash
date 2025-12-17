<?php

namespace App\Services\RouteFixAutomation\Logging;

use App\Services\RouteFixAutomation\Models\FixResult;
use App\Services\RouteFixAutomation\Models\TestResult;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProgressTracker
{
    private array $fixHistory = [];
    private string $logFile;

    public function __construct()
    {
        $this->logFile = 'route-fix-automation-' . date('Y-m-d-H-i-s') . '.log';
    }

    public function logPipelineStart(): void
    {
        $message = "🚀 INICIANDO PIPELINE DE CORREÇÃO DAS ROTAS";
        $this->log('INFO', $message);
        $this->addToHistory('pipeline-start', $message);
    }

    public function logBaseline(TestResult $testResult): void
    {
        $message = "📊 BASELINE INICIAL: {$testResult->functionalControllers}/{$testResult->totalControllers} controllers funcionais ({$testResult->successPercentage}%)";
        $this->log('INFO', $message);
        $this->addToHistory('baseline', $message, $testResult->toArray());
    }

    public function logStepStart(string $step): void
    {
        $stepNames = [
            'service-providers' => '🔥 FASE CRÍTICA: Service Providers',
            'repository-interfaces' => '🔴 FASE ALTA: Repository Interfaces',
            'configuration-problems' => '🟡 FASE MÉDIA: Configuration Problems',
            'missing-services' => '🟢 FASE BAIXA: Missing Services'
        ];

        $message = $stepNames[$step] ?? "Iniciando step: {$step}";
        $this->log('INFO', $message);
        $this->addToHistory("step-start-{$step}", $message);
    }

    public function logStepComplete(string $step, FixResult $result): void
    {
        $message = "✅ STEP {$step} COMPLETO: {$result->totalFixed} correções, {$result->totalErrors} erros";
        $this->log('INFO', $message);
        $this->addToHistory("step-complete-{$step}", $message, $result->toArray());
    }

    public function logIntermediateTest(string $phase, TestResult $testResult): void
    {
        $message = "📈 PROGRESSO {$phase}: {$testResult->functionalControllers}/{$testResult->totalControllers} controllers funcionais ({$testResult->successPercentage}%)";
        $this->log('INFO', $message);
        $this->addToHistory("test-{$phase}", $message, $testResult->toArray());
    }

    public function logFinalTest(TestResult $testResult): void
    {
        $success = $testResult->functionalControllers === $testResult->totalControllers;
        $emoji = $success ? '🎉' : '⚠️';
        $message = "{$emoji} RESULTADO FINAL: {$testResult->functionalControllers}/{$testResult->totalControllers} controllers funcionais ({$testResult->successPercentage}%)";
        
        $this->log($success ? 'INFO' : 'WARNING', $message);
        $this->addToHistory('final-test', $message, $testResult->toArray());
    }

    public function logPipelineComplete(FixResult $result): void
    {
        $message = "🏁 PIPELINE COMPLETO: {$result->totalFixed} correções aplicadas em {$result->executionTime}s";
        $this->log('INFO', $message);
        $this->addToHistory('pipeline-complete', $message, $result->toArray());
    }

    public function logPipelineError(\Exception $e): void
    {
        $message = "❌ ERRO NO PIPELINE: {$e->getMessage()}";
        $this->log('ERROR', $message);
        $this->addToHistory('pipeline-error', $message, [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }

    public function getFixHistory(): array
    {
        return $this->fixHistory;
    }

    private function log(string $level, string $message): void
    {
        Log::channel('single')->log(strtolower($level), $message);
        
        // Também salva em arquivo específico
        $logEntry = "[" . date('Y-m-d H:i:s') . "] {$level}: {$message}\n";
        Storage::disk('local')->append("logs/{$this->logFile}", $logEntry);
    }

    private function addToHistory(string $event, string $message, array $data = []): void
    {
        $this->fixHistory[] = [
            'timestamp' => now()->toISOString(),
            'event' => $event,
            'message' => $message,
            'data' => $data
        ];
    }
}