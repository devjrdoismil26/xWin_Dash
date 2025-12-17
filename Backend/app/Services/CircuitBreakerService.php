<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Circuit Breaker Service
 * 
 * Implementa o padrão Circuit Breaker para APIs externas
 * Protege contra falhas em cascata e permite recuperação automática
 */
class CircuitBreakerService
{
    private array $circuitConfig = [
        'facebook' => [
            'failure_threshold' => 5,
            'timeout' => 60, // segundos
            'half_open_max_calls' => 3,
        ],
        'google' => [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ],
        'twitter' => [
            'failure_threshold' => 3,
            'timeout' => 120,
            'half_open_max_calls' => 2,
        ],
        'linkedin' => [
            'failure_threshold' => 3,
            'timeout' => 120,
            'half_open_max_calls' => 2,
        ],
        'tiktok' => [
            'failure_threshold' => 3,
            'timeout' => 120,
            'half_open_max_calls' => 2,
        ],
        'whatsapp' => [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ],
        'openai' => [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ],
        'claude' => [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ],
        'gemini' => [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ],
    ];

    const STATE_CLOSED = 'closed';
    const STATE_OPEN = 'open';
    const STATE_HALF_OPEN = 'half_open';

    /**
     * Verifica se o circuit breaker permite a chamada
     */
    public function canMakeCall(string $platform, string $endpoint = 'default'): bool
    {
        $state = $this->getCircuitState($platform, $endpoint);

        switch ($state) {
            case self::STATE_CLOSED:
                return true;
            
            case self::STATE_OPEN:
                return $this->shouldAttemptReset($platform, $endpoint);
            
            case self::STATE_HALF_OPEN:
                return $this->canMakeHalfOpenCall($platform, $endpoint);
            
            default:
                return true;
        }
    }

    /**
     * Registra uma chamada bem-sucedida
     */
    public function recordSuccess(string $platform, string $endpoint = 'default'): void
    {
        $this->resetFailureCount($platform, $endpoint);
        
        if ($this->getCircuitState($platform, $endpoint) === self::STATE_HALF_OPEN) {
            $this->setCircuitState($platform, $endpoint, self::STATE_CLOSED);
            Log::info("Circuit breaker closed after successful call", [
                'platform' => $platform,
                'endpoint' => $endpoint
            ]);
        }
    }

    /**
     * Registra uma falha
     */
    public function recordFailure(string $platform, string $endpoint = 'default'): void
    {
        $failureCount = $this->incrementFailureCount($platform, $endpoint);
        $config = $this->circuitConfig[$platform] ?? $this->getDefaultConfig();

        if ($failureCount >= $config['failure_threshold']) {
            $this->setCircuitState($platform, $endpoint, self::STATE_OPEN);
            $this->setCircuitOpenTime($platform, $endpoint, time());
            
            Log::warning("Circuit breaker opened due to failures", [
                'platform' => $platform,
                'endpoint' => $endpoint,
                'failure_count' => $failureCount,
                'threshold' => $config['failure_threshold']
            ]);
        }
    }

    /**
     * Obtém o estado atual do circuit breaker
     */
    public function getCircuitState(string $platform, string $endpoint = 'default'): string
    {
        $key = $this->generateKey($platform, $endpoint, 'state');
        return Cache::get($key, self::STATE_CLOSED);
    }

    /**
     * Obtém estatísticas do circuit breaker
     */
    public function getCircuitStats(string $platform, string $endpoint = 'default'): array
    {
        $key = $this->generateKey($platform, $endpoint);
        $state = $this->getCircuitState($platform, $endpoint);
        $failureCount = Cache::get("{$key}:failures", 0);
        $openTime = Cache::get("{$key}:open_time", null);
        $halfOpenCalls = Cache::get("{$key}:half_open_calls", 0);

        $stats = [
            'platform' => $platform,
            'endpoint' => $endpoint,
            'state' => $state,
            'failure_count' => $failureCount,
            'can_make_call' => $this->canMakeCall($platform, $endpoint),
        ];

        if ($openTime) {
            $stats['open_since'] = date('Y-m-d H:i:s', $openTime);
            $stats['open_duration'] = time() - $openTime;
        }

        if ($state === self::STATE_HALF_OPEN) {
            $stats['half_open_calls'] = $halfOpenCalls;
        }

        return $stats;
    }

    /**
     * Força o circuit breaker para um estado específico
     */
    public function setCircuitState(string $platform, string $endpoint, string $state): void
    {
        $key = $this->generateKey($platform, $endpoint, 'state');
        Cache::put($key, $state, 3600); // 1 hora

        Log::info("Circuit breaker state changed", [
            'platform' => $platform,
            'endpoint' => $endpoint,
            'new_state' => $state
        ]);
    }

    /**
     * Reseta o circuit breaker para o estado fechado
     */
    public function resetCircuit(string $platform, string $endpoint = 'default'): void
    {
        $key = $this->generateKey($platform, $endpoint);
        
        Cache::forget("{$key}:state");
        Cache::forget("{$key}:failures");
        Cache::forget("{$key}:open_time");
        Cache::forget("{$key}:half_open_calls");

        Log::info("Circuit breaker reset", [
            'platform' => $platform,
            'endpoint' => $endpoint
        ]);
    }

    /**
     * Obtém todos os circuit breakers ativos
     */
    public function getAllCircuitStates(): array
    {
        $states = [];
        
        foreach (array_keys($this->circuitConfig) as $platform) {
            $states[$platform] = $this->getCircuitStats($platform);
        }

        return $states;
    }

    // Métodos privados

    private function shouldAttemptReset(string $platform, string $endpoint): bool
    {
        $key = $this->generateKey($platform, $endpoint);
        $openTime = Cache::get("{$key}:open_time");
        
        if (!$openTime) {
            return true;
        }

        $config = $this->circuitConfig[$platform] ?? $this->getDefaultConfig();
        $timeSinceOpen = time() - $openTime;

        if ($timeSinceOpen >= $config['timeout']) {
            $this->setCircuitState($platform, $endpoint, self::STATE_HALF_OPEN);
            $this->resetHalfOpenCalls($platform, $endpoint);
            return true;
        }

        return false;
    }

    private function canMakeHalfOpenCall(string $platform, string $endpoint): bool
    {
        $key = $this->generateKey($platform, $endpoint);
        $halfOpenCalls = Cache::get("{$key}:half_open_calls", 0);
        $config = $this->circuitConfig[$platform] ?? $this->getDefaultConfig();

        return $halfOpenCalls < $config['half_open_max_calls'];
    }

    private function incrementHalfOpenCalls(string $platform, string $endpoint): void
    {
        $key = $this->generateKey($platform, $endpoint);
        $calls = Cache::get("{$key}:half_open_calls", 0);
        Cache::put("{$key}:half_open_calls", $calls + 1, 300); // 5 minutos
    }

    private function resetHalfOpenCalls(string $platform, string $endpoint): void
    {
        $key = $this->generateKey($platform, $endpoint);
        Cache::forget("{$key}:half_open_calls");
    }

    private function incrementFailureCount(string $platform, string $endpoint): int
    {
        $key = $this->generateKey($platform, $endpoint);
        $count = Cache::get("{$key}:failures", 0);
        $newCount = $count + 1;
        Cache::put("{$key}:failures", $newCount, 3600); // 1 hora
        return $newCount;
    }

    private function resetFailureCount(string $platform, string $endpoint): void
    {
        $key = $this->generateKey($platform, $endpoint);
        Cache::forget("{$key}:failures");
    }

    private function setCircuitOpenTime(string $platform, string $endpoint, int $time): void
    {
        $key = $this->generateKey($platform, $endpoint);
        Cache::put("{$key}:open_time", $time, 3600); // 1 hora
    }

    private function generateKey(string $platform, string $endpoint, string $suffix = ''): string
    {
        $baseKey = "circuit:{$platform}:{$endpoint}";
        return $suffix ? "{$baseKey}:{$suffix}" : $baseKey;
    }

    private function getDefaultConfig(): array
    {
        return [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ];
    }
}