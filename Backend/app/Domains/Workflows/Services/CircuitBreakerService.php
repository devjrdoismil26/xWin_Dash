<?php

namespace App\Domains\Workflows\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CircuitBreakerService
{
    private const DEFAULT_FAILURE_THRESHOLD = 5;
    private const DEFAULT_TIMEOUT = 60; // seconds
    private const DEFAULT_RECOVERY_TIMEOUT = 300; // 5 minutes

    /**
     * Execute operation with circuit breaker pattern
     *
     * @param string $serviceName
     * @param callable $operation
     * @param array<string, mixed> $options
     * @return mixed
     */
    public function execute(string $serviceName, callable $operation, array $options = [])
    {
        $failureThreshold = $options['failure_threshold'] ?? self::DEFAULT_FAILURE_THRESHOLD;
        $timeout = $options['timeout'] ?? self::DEFAULT_TIMEOUT;
        $recoveryTimeout = $options['recovery_timeout'] ?? self::DEFAULT_RECOVERY_TIMEOUT;

        $state = $this->getCircuitState($serviceName);

        // Check if circuit is open
        if ($state['status'] === 'open') {
            if ($this->shouldAttemptRecovery($state, $recoveryTimeout)) {
                $this->setCircuitState($serviceName, 'half-open', $state);
                Log::info("Circuit breaker attempting recovery for service: {$serviceName}");
            } else {
                throw new \Exception("Circuit breaker is open for service: {$serviceName}");
            }
        }

        try {
            $startTime = microtime(true);
            $result = $operation();
            $executionTime = microtime(true) - $startTime;

            // Success - reset failure count
            if ($state['status'] === 'half-open') {
                $this->setCircuitState($serviceName, 'closed', [
                    'failure_count' => 0,
                    'last_failure' => null,
                    'last_success' => now()->toISOString(),
                    'total_requests' => $state['total_requests'] + 1,
                    'successful_requests' => $state['successful_requests'] + 1
                ]);
                Log::info("Circuit breaker recovered for service: {$serviceName}");
            } else {
                $this->incrementSuccess($serviceName, $state);
            }

            return $result;
        } catch (\Exception $e) {
            $this->incrementFailure($serviceName, $state, $failureThreshold);

            Log::warning("Circuit breaker failure for service: {$serviceName}", [
                'error' => $e->getMessage(),
                'failure_count' => $state['failure_count'] + 1
            ]);

            throw $e;
        }
    }

    /**
     * Get circuit breaker state
     *
     * @param string $serviceName
     * @return array<string, mixed>
     */
    public function getCircuitState(string $serviceName): array
    {
        $cacheKey = "circuit_breaker_{$serviceName}";
        $defaultState = [
            'status' => 'closed',
            'failure_count' => 0,
            'last_failure' => null,
            'last_success' => null,
            'total_requests' => 0,
            'successful_requests' => 0,
            'created_at' => now()->toISOString()
        ];

        return Cache::get($cacheKey, $defaultState);
    }

    /**
     * Set circuit breaker state
     *
     * @param string $serviceName
     * @param string $status
     * @param array<string, mixed> $state
     * @return void
     */
    private function setCircuitState(string $serviceName, string $status, array $state): void
    {
        $cacheKey = "circuit_breaker_{$serviceName}";
        $state['status'] = $status;
        $state['updated_at'] = now()->toISOString();

        Cache::put($cacheKey, $state, 3600); // Cache for 1 hour
    }

    /**
     * Check if circuit should attempt recovery
     *
     * @param array<string, mixed> $state
     * @param int $recoveryTimeout
     * @return bool
     */
    private function shouldAttemptRecovery(array $state, int $recoveryTimeout): bool
    {
        if (!isset($state['last_failure'])) {
            return true;
        }

        $lastFailure = \Carbon\Carbon::parse($state['last_failure']);
        return $lastFailure->addSeconds($recoveryTimeout)->isPast();
    }

    /**
     * Increment success count
     *
     * @param string $serviceName
     * @param array<string, mixed> $state
     * @return void
     */
    private function incrementSuccess(string $serviceName, array $state): void
    {
        $state['failure_count'] = max(0, $state['failure_count'] - 1);
        $state['last_success'] = now()->toISOString();
        $state['total_requests'] = ($state['total_requests'] ?? 0) + 1;
        $state['successful_requests'] = ($state['successful_requests'] ?? 0) + 1;

        $this->setCircuitState($serviceName, 'closed', $state);
    }

    /**
     * Increment failure count
     *
     * @param string $serviceName
     * @param array<string, mixed> $state
     * @param int $failureThreshold
     * @return void
     */
    private function incrementFailure(string $serviceName, array $state, int $failureThreshold): void
    {
        $state['failure_count'] = ($state['failure_count'] ?? 0) + 1;
        $state['last_failure'] = now()->toISOString();
        $state['total_requests'] = ($state['total_requests'] ?? 0) + 1;

        if ($state['failure_count'] >= $failureThreshold) {
            $this->setCircuitState($serviceName, 'open', $state);
            Log::error("Circuit breaker opened for service: {$serviceName}", [
                'failure_count' => $state['failure_count'],
                'threshold' => $failureThreshold
            ]);
        } else {
            $this->setCircuitState($serviceName, 'closed', $state);
        }
    }

    /**
     * Get circuit breaker statistics
     *
     * @param string $serviceName
     * @return array<string, mixed>
     */
    public function getCircuitStats(string $serviceName): array
    {
        $state = $this->getCircuitState($serviceName);

        $successRate = 0;
        if ($state['total_requests'] > 0) {
            $successRate = ($state['successful_requests'] / $state['total_requests']) * 100;
        }

        return [
            'service_name' => $serviceName,
            'status' => $state['status'],
            'failure_count' => $state['failure_count'],
            'total_requests' => $state['total_requests'],
            'successful_requests' => $state['successful_requests'],
            'success_rate' => round($successRate, 2),
            'last_failure' => $state['last_failure'],
            'last_success' => $state['last_success'],
            'is_healthy' => $state['status'] === 'closed' && $successRate > 90
        ];
    }

    /**
     * Get all circuit breaker states
     *
     * @return array<string, mixed>
     */
    public function getAllCircuitStates(): array
    {
        $services = [
            'ai_service',
            'social_buffer_service',
            'ads_service',
            'webhook_service',
            'email_service',
            'sms_service'
        ];

        $states = [];
        foreach ($services as $service) {
            $states[$service] = $this->getCircuitStats($service);
        }

        return [
            'services' => $states,
            'total_services' => count($services),
            'healthy_services' => count(array_filter($states, fn($state) => $state['is_healthy'])),
            'unhealthy_services' => count(array_filter($states, fn($state) => !$state['is_healthy']))
        ];
    }

    /**
     * Reset circuit breaker for service
     *
     * @param string $serviceName
     * @return array<string, mixed>
     */
    public function resetCircuit(string $serviceName): array
    {
        $cacheKey = "circuit_breaker_{$serviceName}";
        Cache::forget($cacheKey);

        Log::info("Circuit breaker reset for service: {$serviceName}");

        return [
            'success' => true,
            'message' => "Circuit breaker reset for service: {$serviceName}"
        ];
    }

    /**
     * Force circuit breaker to open
     *
     * @param string $serviceName
     * @return array<string, mixed>
     */
    public function forceOpenCircuit(string $serviceName): array
    {
        $state = $this->getCircuitState($serviceName);
        $state['failure_count'] = 999; // Force open
        $state['last_failure'] = now()->toISOString();

        $this->setCircuitState($serviceName, 'open', $state);

        Log::warning("Circuit breaker force opened for service: {$serviceName}");

        return [
            'success' => true,
            'message' => "Circuit breaker force opened for service: {$serviceName}"
        ];
    }

    /**
     * Force circuit breaker to close
     *
     * @param string $serviceName
     * @return array<string, mixed>
     */
    public function forceCloseCircuit(string $serviceName): array
    {
        $state = $this->getCircuitState($serviceName);
        $state['failure_count'] = 0;
        $state['last_success'] = now()->toISOString();

        $this->setCircuitState($serviceName, 'closed', $state);

        Log::info("Circuit breaker force closed for service: {$serviceName}");

        return [
            'success' => true,
            'message' => "Circuit breaker force closed for service: {$serviceName}"
        ];
    }

    /**
     * Check if service is available
     *
     * @param string $serviceName
     * @return bool
     */
    public function isServiceAvailable(string $serviceName): bool
    {
        $state = $this->getCircuitState($serviceName);
        return $state['status'] !== 'open';
    }

    /**
     * Get circuit breaker health status
     *
     * @return array<string, mixed>
     */
    public function getHealthStatus(): array
    {
        $allStates = $this->getAllCircuitStates();

        $healthyCount = $allStates['healthy_services'];
        $totalCount = $allStates['total_services'];

        $healthPercentage = $totalCount > 0 ? ($healthyCount / $totalCount) * 100 : 100;

        return [
            'overall_health' => $healthPercentage,
            'status' => $healthPercentage > 80 ? 'healthy' : ($healthPercentage > 50 ? 'warning' : 'critical'),
            'healthy_services' => $healthyCount,
            'total_services' => $totalCount,
            'unhealthy_services' => $allStates['unhealthy_services'],
            'timestamp' => now()->toISOString()
        ];
    }
}
