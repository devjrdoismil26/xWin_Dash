<?php

namespace App\Console\Commands;

use App\Domains\Universe\Application\Services\UniverseMonitoringService;
use Illuminate\Console\Command;

class UniverseMonitoringCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'universe:monitor 
                            {--report : Generate monitoring report}
                            {--alerts : Check for alerts only}
                            {--save : Save metrics to database}';

    /**
     * The console command description.
     */
    protected $description = 'Monitor Universe module performance and health';

    protected UniverseMonitoringService $monitoringService;

    public function __construct(UniverseMonitoringService $monitoringService)
    {
        parent::__construct();
        $this->monitoringService = $monitoringService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Starting Universe monitoring...');

        try {
            if ($this->option('report')) {
                return $this->generateReport();
            }

            if ($this->option('alerts')) {
                return $this->checkAlerts();
            }

            if ($this->option('save')) {
                return $this->saveMetrics();
            }

            // Monitoramento completo
            return $this->fullMonitoring();

        } catch (\Exception $e) {
            $this->error('❌ Monitoring failed: ' . $e->getMessage());
            return 1;
        }
    }

    protected function generateReport(): int
    {
        $this->info('📊 Generating monitoring report...');

        $report = $this->monitoringService->generateReport();

        $this->displayReport($report);

        return 0;
    }

    protected function checkAlerts(): int
    {
        $this->info('🚨 Checking for alerts...');

        $this->monitoringService->collectMetrics();
        $issues = $this->monitoringService->detectIssues();

        if (empty($issues)) {
            $this->info('✅ No issues detected');
            return 0;
        }

        $this->displayIssues($issues);
        $this->monitoringService->sendAlerts();

        return count(array_filter($issues, fn($i) => $i['severity'] === 'critical')) > 0 ? 1 : 0;
    }

    protected function saveMetrics(): int
    {
        $this->info('💾 Saving metrics to database...');

        $this->monitoringService->collectMetrics();
        $this->monitoringService->detectIssues();
        $this->monitoringService->saveMetrics();

        $this->info('✅ Metrics saved successfully');
        return 0;
    }

    protected function fullMonitoring(): int
    {
        $this->info('🔄 Running full monitoring cycle...');

        // Coletar métricas
        $this->info('📈 Collecting metrics...');
        $metrics = $this->monitoringService->collectMetrics();

        // Detectar problemas
        $this->info('🔍 Detecting issues...');
        $issues = $this->monitoringService->detectIssues();

        // Salvar métricas
        $this->info('💾 Saving metrics...');
        $this->monitoringService->saveMetrics();

        // Enviar alertas se necessário
        if (!empty($issues)) {
            $this->info('📧 Sending alerts...');
            $this->monitoringService->sendAlerts();
        }

        // Exibir resumo
        $this->displaySummary($metrics, $issues);

        return empty($issues) ? 0 : 1;
    }

    protected function displayReport(array $report): void
    {
        $this->newLine();
        $this->info('📊 UNIVERSE MONITORING REPORT');
        $this->info('============================');
        $this->newLine();

        $this->info("Environment: {$report['environment']}");
        $this->info("Status: {$report['status']}");
        $this->info("Timestamp: {$report['timestamp']}");
        $this->newLine();

        // Métricas do sistema
        if (isset($report['metrics']['system'])) {
            $this->info('🖥️  SYSTEM METRICS');
            $this->info('-----------------');
            $system = $report['metrics']['system'];
            
            $this->line("Memory Usage: {$this->formatBytes($system['memory_usage'])} / {$this->formatBytes($this->parseMemoryLimit($system['memory_limit']))}");
            $this->line("Memory Peak: {$this->formatBytes($system['memory_peak'])}");
            $this->line("CPU Usage: {$system['cpu_usage']}%");
            $this->line("Disk Usage: {$this->formatBytes($system['disk_usage']['used'])} / {$this->formatBytes($system['disk_usage']['total'])} ({$system['disk_usage']['percentage']}%)");
            $this->newLine();
        }

        // Métricas do Universe
        if (isset($report['metrics']['universe'])) {
            $this->info('🌌 UNIVERSE METRICS');
            $this->info('------------------');
            $universe = $report['metrics']['universe'];
            
            $this->line("Total Instances: {$universe['total_instances']}");
            $this->line("Active Instances: {$universe['active_instances']}");
            $this->line("Total Templates: {$universe['total_templates']}");
            $this->line("API Requests: {$universe['api_requests']}");
            $this->line("Error Rate: {$universe['error_rate']}%");
            $this->line("Response Time: {$universe['response_time']}s");
            $this->newLine();
        }

        // Performance
        if (isset($report['metrics']['performance'])) {
            $this->info('⚡ PERFORMANCE METRICS');
            $this->info('---------------------');
            $performance = $report['metrics']['performance'];
            
            $this->line("Response Time (Avg): {$performance['response_time_avg']}s");
            $this->line("Response Time (P95): {$performance['response_time_p95']}s");
            $this->line("Response Time (P99): {$performance['response_time_p99']}s");
            $this->line("Throughput: {$performance['throughput']} req/s");
            $this->line("Availability: {$performance['availability']}%");
            $this->newLine();
        }

        // Issues
        if (!empty($report['issues'])) {
            $this->displayIssues($report['issues']);
        } else {
            $this->info('✅ No issues detected');
        }
    }

    protected function displayIssues(array $issues): void
    {
        $this->info('🚨 DETECTED ISSUES');
        $this->info('==================');

        foreach ($issues as $issue) {
            $icon = $issue['severity'] === 'critical' ? '🔴' : '🟡';
            $this->line("{$icon} [{$issue['severity']}] {$issue['message']}");
        }

        $this->newLine();
    }

    protected function displaySummary(array $metrics, array $issues): void
    {
        $this->newLine();
        $this->info('📋 MONITORING SUMMARY');
        $this->info('====================');

        $criticalCount = count(array_filter($issues, fn($i) => $i['severity'] === 'critical'));
        $warningCount = count(array_filter($issues, fn($i) => $i['severity'] === 'warning'));

        $this->line("Total Issues: " . count($issues));
        $this->line("Critical: {$criticalCount}");
        $this->line("Warning: {$warningCount}");

        if (empty($issues)) {
            $this->info('✅ System is healthy');
        } else {
            $this->warn('⚠️  Issues detected - check logs for details');
        }

        $this->newLine();
    }

    protected function formatBytes($bytes): string
    {
        if (is_string($bytes)) {
            $bytes = $this->parseMemoryLimit($bytes);
        }
        
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    protected function parseMemoryLimit(string $limit): int
    {
        $limit = trim($limit);
        $last = strtolower($limit[strlen($limit) - 1]);
        $limit = (int) $limit;

        switch ($last) {
            case 'g':
                $limit *= 1024;
            case 'm':
                $limit *= 1024;
            case 'k':
                $limit *= 1024;
        }

        return $limit;
    }
}