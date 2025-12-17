<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para transportar credenciais de API de forma segura.
 *
 * Em vez de passar múltiplos parâmetros de configuração (tokens, chaves, segredos)
 * para os serviços de integração, este DTO os encapsula em um único objeto.
 * Isso melhora a clareza, a segurança e a testabilidade do código.
 */
class PlatformCredentialsDTO
{
    /**
     * @var string o nome da plataforma (ex: 'facebook', 'google')
     */
    public string $platform;

    /**
     * @var string|null o token de acesso para a API
     */
    public ?string $accessToken;

    /**
     * @var string|null o token de atualização, se aplicável
     */
    public ?string $refreshToken;

    /**
     * @var string|null a chave da API
     */
    public ?string $apiKey;

    /**
     * @var string|null o segredo do cliente ou da API
     */
    public ?string $clientSecret;

    /**
     * @var string|null o ID da conta de anúncios ou cliente
     */
    public ?string $accountId;

    /**
     * Construtor do DTO de credenciais.
     *
     * @param string      $platform
     * @param string|null $accessToken
     * @param string|null $refreshToken
     * @param string|null $apiKey
     * @param string|null $clientSecret
     * @param string|null $accountId
     */
    public function __construct(
        string $platform,
        ?string $accessToken = null,
        ?string $refreshToken = null,
        ?string $apiKey = null,
        ?string $clientSecret = null,
        ?string $accountId = null,
    ) {
        $this->platform = $platform;
        $this->accessToken = $accessToken;
        $this->refreshToken = $refreshToken;
        $this->apiKey = $apiKey;
        $this->clientSecret = $clientSecret;
        $this->accountId = $accountId;
    }

    /**
     * Converte o DTO para um array, útil para logging (cuidado para não logar segredos).
     *
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'platform' => $this->platform,
            'access_token_present' => !is_null($this->accessToken),
            'refresh_token_present' => !is_null($this->refreshToken),
            'api_key_present' => !is_null($this->apiKey),
            'client_secret_present' => !is_null($this->clientSecret),
            'account_id' => $this->accountId,
        ];
    }
}
