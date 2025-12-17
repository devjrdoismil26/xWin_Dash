<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramService
{
    protected string $baseUrl;

    protected string $accessToken;

    public function __construct()
    {
        $this->baseUrl = config('services.instagram.base_url', 'https://graph.instagram.com/v18.0');
        $this->accessToken = config('services.instagram.access_token'); // Ou obtido dinamicamente
    }

    /**
     * Define o token de acesso para a conta específica.
     *
     * @param string $accessToken
     */
    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    /**
     * Publica uma imagem no Instagram.
     *
     * @param string $imageUrl URL da imagem a ser publicada
     * @param string $caption  legenda da imagem
     *
     * @return array resposta da API do Instagram
     *
     * @throws \Exception se a publicação falhar
     */
    public function publishImage(string $imageUrl, string $caption): array
    {
        Log::info("Publicando imagem no Instagram. URL: {$imageUrl}");

        try {
            // Passo 1: Criar um container de mídia
            $containerResponse = Http::withToken($this->accessToken)
                                    ->post("{$this->baseUrl}/me/media", [
                                        'image_url' => $imageUrl,
                                        'caption' => $caption,
                                    ]);

            if (!$containerResponse->successful()) {
                Log::error("Falha ao criar container de mídia no Instagram: " . $containerResponse->body());
                throw new \Exception("Instagram API Error (Container): " . $containerResponse->body());
            }

            $containerId = $containerResponse->json()['id'];
            Log::info("Container de mídia Instagram criado: {$containerId}");

            // Passo 2: Publicar o container
            $publishResponse = Http::withToken($this->accessToken)
                                    ->post("{$this->baseUrl}/me/media_publish", [
                                        'creation_id' => $containerId,
                                    ]);

            if ($publishResponse->successful()) {
                Log::info("Imagem publicada com sucesso no Instagram.", $publishResponse->json());
                return $publishResponse->json();
            } else {
                Log::error("Falha ao publicar imagem no Instagram: " . $publishResponse->body());
                throw new \Exception("Instagram API Error (Publish): " . $publishResponse->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do Instagram: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém informações da conta do Instagram.
     *
     * @return array resposta da API do Instagram
     *
     * @throws \Exception se a requisição falhar
     */
    public function getAccountInfo(): array
    {
        Log::info("Obtendo informações da conta do Instagram.");

        try {
            $response = Http::withToken($this->accessToken)
                            ->get("{$this->baseUrl}/me");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter informações da conta do Instagram: " . $response->body());
                throw new \Exception("Instagram API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do Instagram: " . $e->getMessage());
            throw $e;
        }
    }
}
