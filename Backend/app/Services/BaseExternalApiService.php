<?php

namespace App\Services;

use App\Services\Contracts\ExternalApiServiceInterface;
use Illuminate\Support\Facades\Log;
use Exception;

abstract class BaseExternalApiService implements ExternalApiServiceInterface
{
    protected RateLimiterService $rateLimiter;
    protected CircuitBreakerService $circuitBreaker;
    protected RetryService $retryService;
    protected string $platform;
    protected string $baseUrl;
    protected array $defaultHeaders = [];

    public function __construct(
        RateLimiterService $rateLimiter,
        CircuitBreakerService $circuitBreaker,
        RetryService $retryService
    ) {
        $this->rateLimiter = $rateLimiter;
        $this->circuitBreaker = $circuitBreaker;
        $this->retryService = $retryService;
        $this->platform = $this->getPlatformName();
        $this->baseUrl = $this->getBaseUrl();
        $this->defaultHeaders = $this->getDefaultHeaders();
    }

    public function makeHttpCall(
        string $method,
        string $endpoint,
        array $data = [],
        array $headers = [],
        string $operationName = 'http_call'
    ): array {
        $fullUrl = $this->baseUrl . $endpoint;
        $allHeaders = array_merge($this->defaultHeaders, $headers);

        return $this->retryService->executeWithRetry(
            function () use ($method, $fullUrl, $data, $allHeaders, $operationName) {
                if (!$this->circuitBreaker->canMakeCall($this->platform, $operationName)) {
                    throw new Exception("Circuit breaker is open for {$this->platform}");
                }

                if (!$this->rateLimiter->canMakeCall($this->platform, $operationName)) {
                    Log::info("Rate limit reached, waiting", [
                        'platform' => $this->platform,
                        'operation' => $operationName
                    ]);
                    $this->rateLimiter->waitForLimit($this->platform, $operationName);
                }

                $response = $this->performHttpRequest($method, $fullUrl, $data, $allHeaders);

                $this->circuitBreaker->recordSuccess($this->platform, $operationName);
                $this->rateLimiter->recordCall($this->platform, $operationName);

                return $response;
            },
            $this->platform,
            $operationName
        );
    }

    protected function performHttpRequest(string $method, string $url, array $data, array $headers): array
    {
        $client = new \GuzzleHttp\Client();
        
        $options = [
            'headers' => $headers,
            'timeout' => 30,
            'connect_timeout' => 10,
        ];

        if (!empty($data)) {
            $options[strtoupper($method) === 'GET' ? 'query' : 'json'] = $data;
        }

        $response = $client->request($method, $url, $options);
        
        return json_decode($response->getBody()->getContents(), true) ?? [];
    }

    abstract public function getPlatformName(): string;
    abstract public function getBaseUrl(): string;
    abstract public function getDefaultHeaders(): array;
}
