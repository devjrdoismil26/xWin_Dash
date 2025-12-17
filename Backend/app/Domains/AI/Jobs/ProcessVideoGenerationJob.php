<?php

namespace App\Domains\AI\Jobs;

use App\Domains\AI\Infrastructure\Http\PyLabClient;
use App\Domains\AI\Services\AIVideoGenerationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ProcessVideoGenerationJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public string $jobId;
    public array $params;
    public array $options;

    /**
     * Timeout do job em segundos
     */
    public int $timeout = 600; // 10 minutos

    /**
     * Número de tentativas
     */
    public int $tries = 3;

    public function __construct(string $jobId, array $params, array $options = [])
    {
        $this->jobId = $jobId;
        $this->params = $params;
        $this->options = $options;
    }

    /**
     * Executar o job
     */
    public function handle(PyLabClient $pyLabClient): void
    {
        try {
            Log::info('Iniciando processamento de vídeo em background', [
                'job_id' => $this->jobId,
                'prompt' => substr($this->params['prompt'], 0, 100)
            ]);

            // Atualizar status para processando
            $this->updateJobStatus('processing', 0);

            // Gerar vídeo via PyLab
            $result = $pyLabClient->generateVideo($this->params);

            if (isset($result['video_url'])) {
                // Salvar resultado
                $finalResult = [
                    'success' => true,
                    'video_url' => $result['video_url'],
                    'duration' => $result['duration'] ?? $this->params['duration'],
                    'format' => $result['format'] ?? 'mp4',
                    'quality' => $this->params['quality'],
                    'metadata' => [
                        'prompt' => $this->params['prompt'],
                        'generated_at' => now()->toISOString(),
                        'provider' => 'PyLab',
                        'model' => $result['model'] ?? 'ModelScope-T2V',
                        'processing_time' => $result['processing_time'] ?? null,
                        'job_id' => $this->jobId
                    ]
                ];

                $this->updateJobStatus('completed', 100, $finalResult);

                Log::info('Vídeo gerado com sucesso', [
                    'job_id' => $this->jobId,
                    'video_url' => $result['video_url']
                ]);

                // Notificar usuário se callback estiver configurado
                $this->notifyCompletion($finalResult);
            } else {
                throw new \Exception('PyLab não retornou URL do vídeo');
            }
        } catch (\Exception $e) {
            Log::error('Erro na geração de vídeo em background', [
                'job_id' => $this->jobId,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts()
            ]);

            $this->updateJobStatus('error', 0, [
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
                'max_attempts' => $this->tries
            ]);

            // Re-lançar exceção para que o Laravel tente novamente
            throw $e;
        }
    }

    /**
     * Atualizar status do job
     */
    private function updateJobStatus(string $status, int $progress, array $result = []): void
    {
        $jobStatus = [
            'job_id' => $this->jobId,
            'status' => $status,
            'progress' => $progress,
            'updated_at' => now()->toISOString(),
            'result' => $result
        ];

        // Salvar no cache por 24 horas
        Cache::put("video_job_{$this->jobId}", $jobStatus, now()->addHours(24));
    }

    /**
     * Notificar conclusão
     */
    private function notifyCompletion(array $result): void
    {
        // Implementar notificação via webhook, email, etc.
        if (isset($this->options['callback_url'])) {
            // Enviar webhook
            $this->sendWebhook($this->options['callback_url'], $result);
        }

        if (isset($this->options['user_id'])) {
            // Notificar via sistema de notificações
            $this->sendUserNotification($this->options['user_id'], $result);
        }
    }

    /**
     * Enviar webhook
     */
    private function sendWebhook(string $url, array $result): void
    {
        try {
            \Http::timeout(10)->post($url, [
                'job_id' => $this->jobId,
                'status' => 'completed',
                'result' => $result,
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            Log::warning('Erro ao enviar webhook', [
                'job_id' => $this->jobId,
                'webhook_url' => $url,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Enviar notificação ao usuário
     */
    private function sendUserNotification(int $userId, array $result): void
    {
        try {
            // Implementar notificação via sistema interno
            Log::info('Notificação de vídeo concluído', [
                'user_id' => $userId,
                'job_id' => $this->jobId,
                'video_url' => $result['video_url'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::warning('Erro ao enviar notificação', [
                'job_id' => $this->jobId,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Lidar com falha do job
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Job de geração de vídeo falhou definitivamente', [
            'job_id' => $this->jobId,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);

        $this->updateJobStatus('failed', 0, [
            'error' => $exception->getMessage(),
            'failed_at' => now()->toISOString(),
            'attempts' => $this->attempts()
        ]);
    }
}
