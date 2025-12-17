<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Facebook Ads Account Service
 *
 * Serviço especializado para operações de conta no Facebook Ads
 * Responsabilidade única: gerenciar informações da conta de anúncios
 */
class FacebookAdsAccountService extends BaseExternalApiService
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
     * Obtém informações da conta de anúncios
     */
    public function getAdAccountInfo(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,account_status,currency,timezone_name,timezone_offset_hours_utc,capabilities'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_account_info'
        );

        return $this->processResponse($response);
    }

    /**
     * Lista todas as contas de anúncios do usuário
     */
    public function listAdAccounts(): array
    {
        $endpoint = "/me/adaccounts";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,account_status,currency,timezone_name,capabilities'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'list_ad_accounts'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/insights";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'impressions,clicks,spend',
            'date_preset' => 'today',
            'level' => 'account'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_usage_stats'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém insights da conta
     */
    public function getAccountInsights(array $params = []): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/insights";
        $defaultParams = [
            'access_token' => $this->accessToken,
            'fields' => 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,cpp,cost_per_conversion,conversions,conversion_values',
            'date_preset' => 'last_30d',
            'level' => 'account'
        ];

        $params = array_merge($defaultParams, $params);

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_account_insights'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém informações do usuário
     */
    public function getUserInfo(): array
    {
        $endpoint = "/me";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,email'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_user_info'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém permissões da conta
     */
    public function getAccountPermissions(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/users";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,role,permissions'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_account_permissions'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém configurações da conta
     */
    public function getAccountSettings(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'id,name,account_status,currency,timezone_name,timezone_offset_hours_utc,capabilities,age,amount_spent,balance,created_time,currency,disable_reason,min_campaign_group_spend_cap,min_daily_budget,spend_cap,updated_time'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_account_settings'
        );

        return $this->processResponse($response);
    }

    /**
     * Verifica se o serviço pode se conectar à API.
     */
    public function canConnect(): bool
    {
        if (!$this->accessToken) {
            return false;
        }

        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                '/me',
                ['access_token' => $this->accessToken],
                [],
                'connection_test'
            );

            return $response['status'] === 200;
        } catch (\Exception $e) {
            Log::error('Facebook Ads connection test failed', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Obtém limites da conta
     */
    public function getAccountLimits(): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => 'min_campaign_group_spend_cap,min_daily_budget,spend_cap'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_account_limits'
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
