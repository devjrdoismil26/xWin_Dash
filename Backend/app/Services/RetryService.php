<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Exception;

/**
 * 🚀 Retry Service
 * 
 * Implementa retry logic com exponential backoff para APIs externas
 * Suporta diferentes estratégias de retry por plataforma
 */
class RetryService
{
    private array $retryConfig = [
        'facebook' => [
            'max_attempts' => 3,
            'base_delay' => 1000, // milissegundos
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
        'google' => [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
        'twitter' => [
            'max_attempts' => 2,
            'base_delay' => 2000,
            'max_delay' => 15000,
            'backoff_multiplier' => 3,
            'jitter' => true,
        ],
        'linkedin' => [
            'max_attempts' => 2,
            'base_delay' => 2000,
            'max_delay' => 15000,
            'backoff_multiplier' => 3,
            'jitter' => true,
        ],
        'tiktok' => [
            'max_attempts' => 2,
            'base_delay' => 2000,
            'max_delay' => 15000,
            'backoff_multiplier' => 3,
            'jitter' => true,
        ],
        'whatsapp' => [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
        'openai' => [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
        'claude' => [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
        'gemini' => [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
    ];

    /**
     * Executa uma operação com retry automático
     */
    public function executeWithRetry(callable $operation, string $platform, string $operationName = 'operation'): mixed
    {
        $config = $this->retryConfig[$platform] ?? $this->getDefaultConfig();
        $lastException = null;

        for ($attempt = 1; $attempt <= $config['max_attempts']; $attempt++) {
            try {
                Log::info("Executing operation with retry", [
                    'platform' => $platform,
                    'operation' => $operationName,
                    'attempt' => $attempt,
                    'max_attempts' => $config['max_attempts']
                ]);

                $result = $operation();
                
                if ($attempt > 1) {
                    Log::info("Operation succeeded after retry", [
                        'platform' => $platform,
                        'operation' => $operationName,
                        'attempt' => $attempt
                    ]);
                }

                return $result;

            } catch (Exception $e) {
                $lastException = $e;
                
                Log::warning("Operation failed, considering retry", [
                    'platform' => $platform,
                    'operation' => $operationName,
                    'attempt' => $attempt,
                    'max_attempts' => $config['max_attempts'],
                    'error' => $e->getMessage(),
                    'retryable' => $this->isRetryableError($e)
                ]);

                // Se não é retryable ou é a última tentativa, não tenta novamente
                if (!$this->isRetryableError($e) || $attempt === $config['max_attempts']) {
                    break;
                }

                // Calcular delay para próxima tentativa
                $delay = $this->calculateDelay($attempt, $config);
                
                Log::info("Waiting before retry", [
                    'platform' => $platform,
                    'operation' => $operationName,
                    'attempt' => $attempt,
                    'delay_ms' => $delay
                ]);

                usleep($delay * 1000); // Converter para microssegundos
            }
        }

        Log::error("Operation failed after all retries", [
            'platform' => $platform,
            'operation' => $operationName,
            'max_attempts' => $config['max_attempts'],
            'last_error' => $lastException?->getMessage()
        ]);

        throw $lastException ?? new Exception("Operation failed after {$config['max_attempts']} attempts");
    }

    /**
     * Verifica se um erro é retryable
     */
    public function isRetryableError(Exception $exception): bool
    {
        $message = strtolower($exception->getMessage());
        $code = $exception->getCode();

        // HTTP status codes que são retryable
        $retryableCodes = [408, 429, 500, 502, 503, 504];
        if (in_array($code, $retryableCodes)) {
            return true;
        }

        // Mensagens de erro que indicam problemas temporários
        $retryableMessages = [
            'timeout',
            'connection',
            'network',
            'rate limit',
            'too many requests',
            'service unavailable',
            'internal server error',
            'bad gateway',
            'gateway timeout',
            'temporary',
            'throttle',
            'quota exceeded',
        ];

        foreach ($retryableMessages as $retryableMessage) {
            if (str_contains($message, $retryableMessage)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calcula o delay para a próxima tentativa
     */
    public function calculateDelay(int $attempt, array $config): int
    {
        $baseDelay = $config['base_delay'];
        $multiplier = $config['backoff_multiplier'];
        $maxDelay = $config['max_delay'];

        // Exponential backoff: delay = base_delay * (multiplier ^ (attempt - 1))
        $delay = $baseDelay * pow($multiplier, $attempt - 1);

        // Aplicar jitter se habilitado
        if ($config['jitter'] ?? true) {
            $jitter = $delay * 0.1; // 10% de jitter
            $delay += rand(-$jitter, $jitter);
        }

        // Limitar ao delay máximo
        return min($delay, $maxDelay);
    }

    /**
     * Obtém configuração de retry para uma plataforma
     */
    public function getRetryConfig(string $platform): array
    {
        return $this->retryConfig[$platform] ?? $this->getDefaultConfig();
    }

    /**
     * Atualiza configuração de retry para uma plataforma
     */
    public function updateRetryConfig(string $platform, array $newConfig): void
    {
        $this->retryConfig[$platform] = array_merge(
            $this->retryConfig[$platform] ?? $this->getDefaultConfig(),
            $newConfig
        );

        Log::info("Retry config updated", [
            'platform' => $platform,
            'new_config' => $newConfig
        ]);
    }

    /**
     * Obtém todas as configurações de retry
     */
    public function getAllRetryConfigs(): array
    {
        return $this->retryConfig;
    }

    /**
     * Executa operação com retry customizado
     */
    public function executeWithCustomRetry(
        callable $operation, 
        string $platform, 
        array $customConfig, 
        string $operationName = 'operation'
    ): mixed {
        $originalConfig = $this->retryConfig[$platform] ?? $this->getDefaultConfig();
        $this->retryConfig[$platform] = array_merge($originalConfig, $customConfig);

        try {
            return $this->executeWithRetry($operation, $platform, $operationName);
        } finally {
            // Restaurar configuração original
            $this->retryConfig[$platform] = $originalConfig;
        }
    }

    private function getDefaultConfig(): array
    {
        return [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ];
    }
}