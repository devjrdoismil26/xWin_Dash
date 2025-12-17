<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Facebook Ads Audience Service
 *
 * Serviço especializado para operações de audiências no Facebook Ads
 * Responsabilidade única: gerenciar audiências personalizadas
 */
class FacebookAdsAudienceService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $adAccountId = null;
    protected ?string $accessToken = null;

    public function __construct(
        \App\Services\RateLimiterService $rateLimiter,
        \App\Services\CircuitBreakerService $circuitBreaker,
        \App\Services\RetryService $retryService,
        ?array $credentials = null
    ) {
        parent::__construct($rateLimiter, $circuitBreaker, $retryService);
        $this->setCredentials($credentials);
    }

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->adAccountId = $credentials['ad_account_id'] ?? null;
    }

    /**
     * Obtém audiences personalizadas
     */
    public function getCustomAudiences(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/customaudiences";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,description,approximate_count,subtype'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_audiences'
        );

        return $this->processResponse($response);
    }

    /**
     * Cria audience personalizada
     */
    public function createCustomAudience(array $audienceData): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/customaudiences";
        $audienceData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $audienceData,
            [],
            'create_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Atualiza uma audience personalizada
     */
    public function updateCustomAudience(string $audienceId, array $data): array
    {
        $endpoint = "/{$audienceId}";
        $data['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $data,
            [],
            'update_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Deleta uma audience personalizada
     */
    public function deleteCustomAudience(string $audienceId): array
    {
        $endpoint = "/{$audienceId}";
        $params = ['access_token' => $this->accessToken];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'delete_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém informações de uma audience específica
     */
    public function getCustomAudience(string $audienceId, array $fields = []): array
    {
        $endpoint = "/{$audienceId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => implode(',', $fields ?: ['id', 'name', 'description', 'approximate_count', 'subtype', 'created_time', 'updated_time'])
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Adiciona usuários a uma audience personalizada
     */
    public function addUsersToAudience(string $audienceId, array $users, string $schema = 'EMAIL_SHA256'): array
    {
        $endpoint = "/{$audienceId}/users";
        $params = [
            'access_token' => $this->accessToken,
            'payload' => [
                'schema' => $schema,
                'data' => $users
            ]
        ];

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $params,
            [],
            'add_users_to_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Remove usuários de uma audience personalizada
     */
    public function removeUsersFromAudience(string $audienceId, array $users, string $schema = 'EMAIL_SHA256'): array
    {
        $endpoint = "/{$audienceId}/users";
        $params = [
            'access_token' => $this->accessToken,
            'payload' => [
                'schema' => $schema,
                'data' => $users
            ]
        ];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'remove_users_from_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém estatísticas de uma audience
     */
    public function getAudienceStats(string $audienceId): array
    {
        $endpoint = "/{$audienceId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'approximate_count,delivery_status,operation_status,permission_for_actions'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_audience_stats'
        );

        return $this->processResponse($response);
    }

    /**
     * Cria uma lookalike audience
     */
    public function createLookalikeAudience(array $audienceData): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/customaudiences";
        $audienceData['access_token'] = $this->accessToken;
        $audienceData['subtype'] = 'LOOKALIKE';

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $audienceData,
            [],
            'create_lookalike_audience'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém audiences de lookalike
     */
    public function getLookalikeAudiences(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/customaudiences";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,description,approximate_count,subtype,lookalike_spec',
            'subtype' => 'LOOKALIKE'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_lookalike_audiences'
        );

        return $this->processResponse($response);
    }

    // Implementação dos métodos abstratos

    public function getPlatformName(): string
    {
        return 'facebook';
    }

    public function getBaseUrl(): string
    {
        return 'https://graph.facebook.com/v18.0';
    }

    public function getDefaultHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'User-Agent' => 'xWin-Dash-FacebookAds/1.0'
        ];
    }

    protected function getHealthCheckEndpoint(): string
    {
        return '/me';
    }

    /**
     * Sobrescreve o método para adicionar access_token automaticamente
     */
    protected function performHttpRequest(string $method, string $url, array $data, array $headers): array
    {
        // Adicionar access_token se não estiver presente
        if ($this->accessToken && !isset($data['access_token'])) {
            $data['access_token'] = $this->accessToken;
        }

        return parent::performHttpRequest($method, $url, $data, $headers);
    }
}
