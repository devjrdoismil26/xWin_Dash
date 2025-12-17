<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * 🔧 Workflow Resource Manager
 *
 * Serviço especializado para gerenciamento de recursos de workflows
 * Responsável por verificar limites e quotas
 */
class WorkflowResourceManager
{
    public function __construct(
        private WorkflowModel $workflows,
        private WorkflowExecutionRepository $executions
    ) {
    }

    /**
     * Verificar limites de recursos
     */
    public function checkResourceLimits(int $workflowId, array $options = []): array
    {
        try {
            $workflow = $this->workflows->find($workflowId);
            if (!$workflow) {
                return [
                    'allowed' => false,
                    'reason' => 'Workflow not found'
                ];
            }

            $userId = $options['user_id'] ?? $workflow->user_id;
            $checks = [];

            // Verificar limite de execuções concorrentes
            $concurrentCheck = $this->checkConcurrentExecutions($userId);
            $checks['concurrent_executions'] = $concurrentCheck;

            // Verificar limite de execuções por hora
            $hourlyCheck = $this->checkHourlyExecutions($userId);
            $checks['hourly_executions'] = $hourlyCheck;

            // Verificar limite de execuções por dia
            $dailyCheck = $this->checkDailyExecutions($userId);
            $checks['daily_executions'] = $dailyCheck;

            // Verificar limite de recursos do sistema
            $systemCheck = $this->checkSystemResources();
            $checks['system_resources'] = $systemCheck;

            // Verificar limite de memória
            $memoryCheck = $this->checkMemoryLimit();
            $checks['memory_limit'] = $memoryCheck;

            // Verificar limite de tempo de execução
            $timeoutCheck = $this->checkTimeoutLimit($workflow);
            $checks['timeout_limit'] = $timeoutCheck;

            // Determinar se é permitido
            $allowed = true;
            $reasons = [];

            foreach ($checks as $checkName => $check) {
                if (!$check['allowed']) {
                    $allowed = false;
                    $reasons[] = $check['reason'];
                }
            }

            return [
                'allowed' => $allowed,
                'checks' => $checks,
                'reasons' => $reasons
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao verificar limites de recursos: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'options' => $options
            ]);

            return [
                'allowed' => false,
                'reason' => 'Error checking resource limits: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar execuções concorrentes
     */
    private function checkConcurrentExecutions(int $userId): array
    {
        try {
            $maxConcurrent = $this->getUserMaxConcurrentExecutions($userId);
            $currentConcurrent = $this->executions->getConcurrentExecutionsCount($userId);

            if ($currentConcurrent >= $maxConcurrent) {
                return [
                    'allowed' => false,
                    'reason' => "Maximum concurrent executions reached ({$currentConcurrent}/{$maxConcurrent})",
                    'current' => $currentConcurrent,
                    'max' => $maxConcurrent
                ];
            }

            return [
                'allowed' => true,
                'current' => $currentConcurrent,
                'max' => $maxConcurrent
            ];
        } catch (\Exception $e) {
            return [
                'allowed' => false,
                'reason' => 'Error checking concurrent executions: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar execuções por hora
     */
    private function checkHourlyExecutions(int $userId): array
    {
        try {
            $maxHourly = $this->getUserMaxHourlyExecutions($userId);
            $currentHourly = $this->executions->getHourlyExecutionsCount($userId);

            if ($currentHourly >= $maxHourly) {
                return [
                    'allowed' => false,
                    'reason' => "Maximum hourly executions reached ({$currentHourly}/{$maxHourly})",
                    'current' => $currentHourly,
                    'max' => $maxHourly
                ];
            }

            return [
                'allowed' => true,
                'current' => $currentHourly,
                'max' => $maxHourly
            ];
        } catch (\Exception $e) {
            return [
                'allowed' => false,
                'reason' => 'Error checking hourly executions: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar execuções por dia
     */
    private function checkDailyExecutions(int $userId): array
    {
        try {
            $maxDaily = $this->getUserMaxDailyExecutions($userId);
            $currentDaily = $this->executions->getDailyExecutionsCount($userId);

            if ($currentDaily >= $maxDaily) {
                return [
                    'allowed' => false,
                    'reason' => "Maximum daily executions reached ({$currentDaily}/{$maxDaily})",
                    'current' => $currentDaily,
                    'max' => $maxDaily
                ];
            }

            return [
                'allowed' => true,
                'current' => $currentDaily,
                'max' => $maxDaily
            ];
        } catch (\Exception $e) {
            return [
                'allowed' => false,
                'reason' => 'Error checking daily executions: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar recursos do sistema
     */
    private function checkSystemResources(): array
    {
        try {
            $cpuUsage = $this->getCpuUsage();
            $memoryUsage = $this->getMemoryUsage();
            $diskUsage = $this->getDiskUsage();

            $maxCpuUsage = 80; // 80%
            $maxMemoryUsage = 85; // 85%
            $maxDiskUsage = 90; // 90%

            if ($cpuUsage > $maxCpuUsage) {
                return [
                    'allowed' => false,
                    'reason' => "High CPU usage ({$cpuUsage}%)",
                    'cpu_usage' => $cpuUsage,
                    'max_cpu_usage' => $maxCpuUsage
                ];
            }

            if ($memoryUsage > $maxMemoryUsage) {
                return [
                    'allowed' => false,
                    'reason' => "High memory usage ({$memoryUsage}%)",
                    'memory_usage' => $memoryUsage,
                    'max_memory_usage' => $maxMemoryUsage
                ];
            }

            if ($diskUsage > $maxDiskUsage) {
                return [
                    'allowed' => false,
                    'reason' => "High disk usage ({$diskUsage}%)",
                    'disk_usage' => $diskUsage,
                    'max_disk_usage' => $maxDiskUsage
                ];
            }

            return [
                'allowed' => true,
                'cpu_usage' => $cpuUsage,
                'memory_usage' => $memoryUsage,
                'disk_usage' => $diskUsage
            ];
        } catch (\Exception $e) {
            return [
                'allowed' => false,
                'reason' => 'Error checking system resources: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar limite de memória
     */
    private function checkMemoryLimit(): array
    {
        try {
            $memoryLimit = ini_get('memory_limit');
            $memoryUsage = memory_get_usage(true);
            $memoryPeak = memory_get_peak_usage(true);

            // Converter limite de memória para bytes
            $memoryLimitBytes = $this->convertToBytes($memoryLimit);
            $memoryUsagePercent = ($memoryUsage / $memoryLimitBytes) * 100;

            $maxMemoryUsage = 80; // 80%

            if ($memoryUsagePercent > $maxMemoryUsage) {
                return [
                    'allowed' => false,
                    'reason' => "High memory usage ({$memoryUsagePercent}%)",
                    'memory_usage' => $memoryUsage,
                    'memory_limit' => $memoryLimitBytes,
                    'memory_usage_percent' => $memoryUsagePercent
                ];
            }

            return [
                'allowed' => true,
                'memory_usage' => $memoryUsage,
                'memory_limit' => $memoryLimitBytes,
                'memory_usage_percent' => $memoryUsagePercent
            ];
        } catch (\Exception $e) {
            return [
                'allowed' => false,
                'reason' => 'Error checking memory limit: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar limite de timeout
     */
    private function checkTimeoutLimit($workflow): array
    {
        try {
            $workflowTimeout = $workflow->timeout ?? 300; // 5 minutos padrão
            $systemTimeout = ini_get('max_execution_time');

            if ($systemTimeout > 0 && $workflowTimeout > $systemTimeout) {
                return [
                    'allowed' => false,
                    'reason' => "Workflow timeout ({$workflowTimeout}s) exceeds system limit ({$systemTimeout}s)",
                    'workflow_timeout' => $workflowTimeout,
                    'system_timeout' => $systemTimeout
                ];
            }

            return [
                'allowed' => true,
                'workflow_timeout' => $workflowTimeout,
                'system_timeout' => $systemTimeout
            ];
        } catch (\Exception $e) {
            return [
                'allowed' => false,
                'reason' => 'Error checking timeout limit: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Obter máximo de execuções concorrentes do usuário
     */
    private function getUserMaxConcurrentExecutions(int $userId): int
    {
        // Implementar lógica baseada no plano do usuário
        return Cache::remember("user_max_concurrent_executions_{$userId}", 3600, function () use ($userId) {
            // Verificar plano do usuário e retornar limite apropriado
            return 5; // Padrão
        });
    }

    /**
     * Obter máximo de execuções por hora do usuário
     */
    private function getUserMaxHourlyExecutions(int $userId): int
    {
        return Cache::remember("user_max_hourly_executions_{$userId}", 3600, function () use ($userId) {
            // Verificar plano do usuário e retornar limite apropriado
            return 100; // Padrão
        });
    }

    /**
     * Obter máximo de execuções por dia do usuário
     */
    private function getUserMaxDailyExecutions(int $userId): int
    {
        return Cache::remember("user_max_daily_executions_{$userId}", 3600, function () use ($userId) {
            // Verificar plano do usuário e retornar limite apropriado
            return 1000; // Padrão
        });
    }

    /**
     * Obter uso de CPU
     */
    private function getCpuUsage(): float
    {
        // Implementar lógica para obter uso de CPU
        // Por enquanto, retornar valor simulado
        return 45.0;
    }

    /**
     * Obter uso de memória
     */
    private function getMemoryUsage(): float
    {
        // Implementar lógica para obter uso de memória
        // Por enquanto, retornar valor simulado
        return 60.0;
    }

    /**
     * Obter uso de disco
     */
    private function getDiskUsage(): float
    {
        // Implementar lógica para obter uso de disco
        // Por enquanto, retornar valor simulado
        return 70.0;
    }

    /**
     * Converter string de memória para bytes
     */
    private function convertToBytes(string $memoryLimit): int
    {
        $memoryLimit = trim($memoryLimit);
        $last = strtolower($memoryLimit[strlen($memoryLimit) - 1]);
        $value = (int) $memoryLimit;

        switch ($last) {
            case 'g':
                $value *= 1024;
                // Fall through to next case
            case 'm':
                $value *= 1024;
                // Fall through to next case
            case 'k':
                $value *= 1024;
        }

        return $value;
    }
}
