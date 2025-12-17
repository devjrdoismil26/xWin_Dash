<?php

namespace App\Infrastructure\Monitoring;

use Illuminate\Queue\QueueManager;
use Illuminate\Support\Facades\Log;

class QueueHealthMonitoringService
{
    protected QueueManager $queueManager;

    public function __construct(QueueManager $queueManager)
    {
        $this->queueManager = $queueManager;
    }

    /**
     * Verifica a saúde de uma fila específica.
     *
     * @param string $queueName o nome da fila a ser monitorada
     *
     * @return array um array com o status da fila
     */
    public function checkQueueHealth(string $queueName = 'default'): array
    {
        Log::info("Verificando saúde da fila: {$queueName}.");

        try {
            $size = $this->queueManager->connection()->size($queueName);
            $failedJobs = $this->getFailedJobsCount();

            $healthStatus = [
                'queue_name' => $queueName,
                'status' => 'healthy',
                'jobs_pending' => $size,
                'jobs_failed' => $failedJobs,
                'last_checked_at' => now()->toDateTimeString(),
            ];

            if ($size > config('queue.thresholds.pending_jobs_warning', 100)) {
                $healthStatus['status'] = 'warning';
                $healthStatus['message'] = 'Alto número de jobs pendentes.';
            }

            if ($failedJobs > config('queue.thresholds.failed_jobs_warning', 10)) {
                $healthStatus['status'] = 'warning';
                $healthStatus['message'] = ($healthStatus['message'] ?? '') . ' Alto número de jobs falhos.';
            }

            if ($size > config('queue.thresholds.pending_jobs_critical', 500) || $failedJobs > config('queue.thresholds.failed_jobs_critical', 50)) {
                $healthStatus['status'] = 'critical';
                $healthStatus['message'] = ($healthStatus['message'] ?? '') . ' Fila em estado crítico.';
            }

            Log::info("Saúde da fila {$queueName}: " . json_encode($healthStatus));
            return $healthStatus;
        } catch (\Exception $e) {
            Log::error("Erro ao verificar saúde da fila {$queueName}: " . $e->getMessage());
            return [
                'queue_name' => $queueName,
                'status' => 'error',
                'message' => $e->getMessage(),
                'last_checked_at' => now()->toDateTimeString(),
            ];
        }
    }

    /**
     * Retorna o número de jobs falhos.
     *
     * @return int
     */
    protected function getFailedJobsCount(): int
    {
        // Isso depende de como os jobs falhos são armazenados (ex: tabela 'failed_jobs')
        // return DB::table('failed_jobs')->count();
        return 0; // Simulação
    }
}
