<?php

namespace App\Domains\ADStool\Integrations;

use App\Domains\ADStool\Domain\ADSCampaign;
use Exception;
use Illuminate\Support\Facades\Http;

/**
 * Serviço responsável pela comunicação direta com a API de anúncios do Facebook.
 * Esta classe encapsula todos os detalhes da API, como endpoints, autenticação
 * e formatação de dados para as requisições.
 */
class FacebookAdsIntegrationService
{
    /**
     * @var string URL base da API de Marketing do Facebook
     */
    protected $baseUrl;

    /**
     * @var string token de acesso para autenticação na API
     */
    protected $accessToken;

    /**
     * @var string ID da conta de anúncios
     */
    protected $adAccountId;

    /**
     * Construtor do serviço de integração com o Facebook Ads.
     *
     * As credenciais e configurações seriam idealmente carregadas de um
     * serviço de configuração ou de um DTO de credenciais.
     */
    public function __construct()
    {
        // Em um cenário real, as credenciais viriam de forma segura do banco de dados
        // ou de um serviço de configuração injetado.
        $this->baseUrl = config('services.facebook.graph_url', 'https://graph.facebook.com/v18.0');
        $this->accessToken = config('services.facebook.access_token'); // Exemplo: buscaria do ApiSettingModel
        $this->adAccountId = config('services.facebook.ad_account_id'); // Exemplo: buscaria do ApiSettingModel
    }

    /**
     * Cria uma nova campanha na plataforma do Facebook Ads.
     *
     * @param ADSCampaign $campaign a entidade de campanha do nosso domínio
     *
     * @return array<string, mixed> o resultado da criação da campanha retornado pela API
     *
     * @throws Exception se a requisição para a API falhar
     */
    public function createCampaign(ADSCampaign $campaign): array
    {
        $endpoint = "{$this->baseUrl}/act_{$this->adAccountId}/campaigns";

        // Mapeia os dados da nossa entidade de domínio para o formato esperado pela API do Facebook.
        // Um Mapper dedicado (FacebookAdsMapper) seria ideal aqui.
        $params = [
            'name' => $campaign->name,
            'objective' => $campaign->objective, // Ex: 'LINK_CLICKS'
            'status' => 'PAUSED', // É uma boa prática criar campanhas pausadas para revisão.
            'special_ad_categories' => [],
            'access_token' => $this->accessToken,
        ];

        $response = Http::post($endpoint, $params);

        if ($response->failed()) {
            throw new Exception('Falha ao criar campanha no Facebook Ads: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Atualiza uma campanha existente no Facebook Ads.
     *
     * @param string $platformCampaignId o ID da campanha na plataforma do Facebook
     * @param array<string, mixed>  $data               os dados a serem atualizados
     *
     * @return array<string, mixed> o resultado da atualização
     *
     * @throws Exception se a requisição para a API falhar
     */
    public function updateCampaign(string $platformCampaignId, array $data): array
    {
        $endpoint = "{$this->baseUrl}/{$platformCampaignId}";

        $params = array_merge($data, ['access_token' => $this->accessToken]);

        $response = Http::post($endpoint, $params);

        if ($response->failed()) {
            throw new Exception('Falha ao atualizar campanha no Facebook Ads: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Busca os dados de uma campanha específica no Facebook Ads.
     *
     * @param string $platformCampaignId o ID da campanha na plataforma
     *
     * @return array<string, mixed> os dados da campanha
     *
     * @throws Exception se a requisição para a API falhar
     */
    public function getCampaign(string $platformCampaignId): array
    {
        $endpoint = "{$this->baseUrl}/{$platformCampaignId}";

        $params = [
            'fields' => 'id,name,objective,status,daily_budget',
            'access_token' => $this->accessToken,
        ];

        $response = Http::get($endpoint, $params);

        if ($response->failed()) {
            throw new Exception('Falha ao buscar campanha no Facebook Ads: ' . $response->body());
        }

        return $response->json();
    }
}
