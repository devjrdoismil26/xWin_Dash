<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * 🚀 OAuth 1.0a Service
 * 
 * Implementação completa do protocolo OAuth 1.0a
 * Usado principalmente para Twitter API
 */
class OAuth1Service
{
    private string $consumerKey;
    private string $consumerSecret;
    private ?string $accessToken = null;
    private ?string $accessTokenSecret = null;
    private string $signatureMethod = 'HMAC-SHA1';
    private string $version = '1.0';

    public function __construct(string $consumerKey, string $consumerSecret)
    {
        $this->consumerKey = $consumerKey;
        $this->consumerSecret = $consumerSecret;
    }

    /**
     * Define as credenciais de acesso
     */
    public function setAccessCredentials(string $accessToken, string $accessTokenSecret): void
    {
        $this->accessToken = $accessToken;
        $this->accessTokenSecret = $accessTokenSecret;
    }

    /**
     * Gera headers OAuth 1.0a para uma requisição
     */
    public function generateAuthHeaders(string $method, string $url, array $params = []): array
    {
        $oauthParams = $this->getOAuthParams();
        $allParams = array_merge($params, $oauthParams);
        
        // Ordenar parâmetros
        ksort($allParams);
        
        // Criar string de parâmetros
        $paramString = $this->createParamString($allParams);
        
        // Criar string de assinatura
        $signatureBaseString = $this->createSignatureBaseString($method, $url, $paramString);
        
        // Gerar assinatura
        $signature = $this->generateSignature($signatureBaseString);
        
        // Adicionar assinatura aos parâmetros OAuth
        $oauthParams['oauth_signature'] = $signature;
        
        // Criar header Authorization
        $authHeader = 'OAuth ' . $this->createParamString($oauthParams, true);
        
        return [
            'Authorization' => $authHeader,
            'Content-Type' => 'application/x-www-form-urlencoded'
        ];
    }

    /**
     * Obtém parâmetros OAuth básicos
     */
    private function getOAuthParams(): array
    {
        $params = [
            'oauth_consumer_key' => $this->consumerKey,
            'oauth_nonce' => $this->generateNonce(),
            'oauth_signature_method' => $this->signatureMethod,
            'oauth_timestamp' => time(),
            'oauth_version' => $this->version
        ];

        if ($this->accessToken) {
            $params['oauth_token'] = $this->accessToken;
        }

        return $params;
    }

    /**
     * Gera nonce único
     */
    private function generateNonce(): string
    {
        return md5(uniqid(rand(), true));
    }

    /**
     * Cria string de parâmetros
     */
    private function createParamString(array $params, bool $forHeader = false): string
    {
        $pairs = [];
        foreach ($params as $key => $value) {
            $pairs[] = $this->encode($key) . '=' . $this->encode($value);
        }
        
        return implode($forHeader ? ', ' : '&', $pairs);
    }

    /**
     * Cria string base para assinatura
     */
    private function createSignatureBaseString(string $method, string $url, string $paramString): string
    {
        return strtoupper($method) . '&' . $this->encode($url) . '&' . $this->encode($paramString);
    }

    /**
     * Gera assinatura HMAC-SHA1
     */
    private function generateSignature(string $signatureBaseString): string
    {
        $signingKey = $this->encode($this->consumerSecret) . '&';
        if ($this->accessTokenSecret) {
            $signingKey .= $this->encode($this->accessTokenSecret);
        }

        return base64_encode(hash_hmac('sha1', $signatureBaseString, $signingKey, true));
    }

    /**
     * Codifica string para OAuth
     */
    private function encode(string $string): string
    {
        return rawurlencode($string);
    }

    /**
     * Decodifica string OAuth
     */
    private function decode(string $string): string
    {
        return rawurldecode($string);
    }

    /**
     * Faz requisição OAuth 1.0a
     */
    public function makeRequest(string $method, string $url, array $params = [], array $headers = []): array
    {
        $oauthHeaders = $this->generateAuthHeaders($method, $url, $params);
        $allHeaders = array_merge($headers, $oauthHeaders);

        $client = new \GuzzleHttp\Client();
        
        $options = [
            'headers' => $allHeaders,
            'timeout' => 30,
            'connect_timeout' => 10,
        ];

        if (!empty($params) && strtoupper($method) !== 'GET') {
            $options['form_params'] = $params;
        } elseif (!empty($params) && strtoupper($method) === 'GET') {
            $url .= '?' . http_build_query($params);
        }

        try {
            $response = $client->request($method, $url, $options);
            
            return [
                'status' => $response->getStatusCode(),
                'headers' => $response->getHeaders(),
                'body' => $response->getBody()->getContents(),
                'json' => json_decode($response->getBody()->getContents(), true)
            ];
        } catch (\Exception $e) {
            Log::error('OAuth 1.0a request failed', [
                'method' => $method,
                'url' => $url,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Faz requisição GET
     */
    public function get(string $url, array $params = [], array $headers = []): array
    {
        return $this->makeRequest('GET', $url, $params, $headers);
    }

    /**
     * Faz requisição POST
     */
    public function post(string $url, array $params = [], array $headers = []): array
    {
        return $this->makeRequest('POST', $url, $params, $headers);
    }

    /**
     * Faz requisição PUT
     */
    public function put(string $url, array $params = [], array $headers = []): array
    {
        return $this->makeRequest('PUT', $url, $params, $headers);
    }

    /**
     * Faz requisição DELETE
     */
    public function delete(string $url, array $params = [], array $headers = []): array
    {
        return $this->makeRequest('DELETE', $url, $params, $headers);
    }

    /**
     * Valida resposta OAuth
     */
    public function validateResponse(array $response): void
    {
        if ($response['status'] >= 400) {
            $error = $response['json'] ?? ['message' => 'Unknown error'];
            throw new \Exception("OAuth 1.0a Error: HTTP {$response['status']} - " . json_encode($error));
        }
    }

    /**
     * Processa resposta OAuth
     */
    public function processResponse(array $response): array
    {
        $this->validateResponse($response);
        
        if (isset($response['json'])) {
            return $response['json'];
        }

        return [
            'status' => $response['status'],
            'data' => $response['body']
        ];
    }
}