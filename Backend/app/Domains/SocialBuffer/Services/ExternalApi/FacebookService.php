<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacebookService
{
    protected string $baseUrl;

    protected string $accessToken;

    public function __construct()
    {
        $this->baseUrl = config('services.facebook.base_url', 'https://graph.facebook.com/v18.0');
        $this->accessToken = config('services.facebook.access_token'); // Ou obtido dinamicamente
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
     * Publica um post no Facebook.
     *
     * @param string $message   o conteúdo do post
     * @param array  $mediaUrls URLs das mídias a serem anexadas
     *
     * @return array resposta da API do Facebook
     *
     * @throws \Exception se a publicação falhar
     */
    public function publishPost(string $message, array $mediaUrls = []): array
    {
        Log::info("Publicando post no Facebook. Conteúdo: {$message}");

        try {
            $postData = [];

            if (!empty($mediaUrls)) {
                // Post com mídia - usar endpoint de photos/videos
                $mediaUrl = $mediaUrls[0]; // Facebook geralmente aceita uma mídia por post

                if ($this->isVideoUrl($mediaUrl)) {
                    // Publicar vídeo
                    $postData = [
                        'description' => $message,
                        'source' => $mediaUrl,
                    ];
                    $endpoint = "{$this->baseUrl}/me/videos";
                } else {
                    // Publicar foto
                    $postData = [
                        'caption' => $message,
                        'url' => $mediaUrl,
                    ];
                    $endpoint = "{$this->baseUrl}/me/photos";
                }
            } else {
                // Post apenas texto
                $postData = ['message' => $message];
                $endpoint = "{$this->baseUrl}/me/feed";
            }

            $response = Http::withToken($this->accessToken)
                            ->post($endpoint, $postData);

            if ($response->successful()) {
                Log::info("Post publicado com sucesso no Facebook.", $response->json());
                return $response->json();
            } else {
                Log::error("Falha ao publicar post no Facebook: " . $response->body());
                throw new \Exception("Facebook API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do Facebook: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Verifica se a URL é de um vídeo.
     *
     * @param string $url
     * @return bool
     */
    protected function isVideoUrl(string $url): bool
    {
        $videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'];
        $extension = strtolower(pathinfo($url, PATHINFO_EXTENSION));
        return in_array($extension, $videoExtensions);
    }

    /**
     * Obtém informações da página/perfil do Facebook.
     *
     * @return array resposta da API do Facebook
     *
     * @throws \Exception se a requisição falhar
     */
    public function getAccountInfo(): array
    {
        Log::info("Obtendo informações da conta do Facebook.");

        try {
            $response = Http::withToken($this->accessToken)
                            ->get("{$this->baseUrl}/me");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter informações da conta do Facebook: " . $response->body());
                throw new \Exception("Facebook API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do Facebook: " . $e->getMessage());
            throw $e;
        }
    }
}
