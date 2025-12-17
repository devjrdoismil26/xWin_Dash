<?php

namespace App\Domains\Integrations\Services\Providers;

use App\Domains\Integrations\Models\Integration;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseProvider implements IntegrationProviderInterface
{
    protected Integration $integration;
    protected array $config;
    protected RateLimiterService $rateLimiter;
    protected CircuitBreakerService $circuitBreaker;
    protected RetryService $retryService;

    public function __construct(
        Integration $integration,
        ?RateLimiterService $rateLimiter = null,
        ?CircuitBreakerService $circuitBreaker = null,
        ?RetryService $retryService = null
    ) {
        $this->integration = $integration;
        $this->config = $integration->config ?? [];
        $this->rateLimiter = $rateLimiter ?? app(RateLimiterService::class);
        $this->circuitBreaker = $circuitBreaker ?? app(CircuitBreakerService::class);
        $this->retryService = $retryService ?? app(RetryService::class);
    }

    protected function getCredentials(): ?array
    {
        if (!$this->integration->credentials) {
            return null;
        }

        return $this->integration->credentials->credentials ?? null;
    }

    protected function makeRequest(string $method, string $url, array $options = []): array
    {
        $platform = $this->integration->provider;
        $operation = $method . '_' . parse_url($url, PHP_URL_PATH);

        return $this->retryService->executeWithRetry(
            function () use ($method, $url, $options, $platform, $operation) {
                // Check circuit breaker
                if (!$this->circuitBreaker->canMakeCall($platform, $operation)) {
                    Log::warning("Circuit breaker open for {$platform}");
                    throw new \Exception("Circuit breaker is open for {$platform}");
                }

                // Check rate limit
                if (!$this->rateLimiter->canMakeCall($platform, $operation)) {
                    Log::info("Rate limit reached for {$platform}, waiting...");
                    $this->rateLimiter->waitForLimit($platform, $operation);
                }

                // Make HTTP request
                $response = Http::withHeaders($this->getHeaders())
                    ->$method($url, $options);

                if ($response->failed()) {
                    $this->circuitBreaker->recordFailure($platform, $operation);
                    throw new \Exception("API request failed: " . $response->body());
                }

                // Record success
                $this->circuitBreaker->recordSuccess($platform, $operation);
                $this->rateLimiter->recordCall($platform, $operation);

                return $response->json();
            },
            $platform,
            $operation
        );
    }

    protected function getHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ];
    }

    abstract public function testConnection(): array;
    abstract public function sync(): array;
    abstract public function getAuthUrl(): string;
    abstract public function handleCallback(array $params): array;
}
