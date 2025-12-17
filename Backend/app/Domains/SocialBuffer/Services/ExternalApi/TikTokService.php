<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TikTokService
{
    protected string $baseUrl;
    protected string $accessToken;

    public function __construct()
    {
        $this->baseUrl = config('services.tiktok.base_url', 'https://open-api.tiktok.com');
        $this->accessToken = config('services.tiktok.access_token');
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
     * Publica um vídeo no TikTok.
     *
     * @param string $videoUrl URL do vídeo
     * @param string $caption Legenda do vídeo
     * @param array $options Opções adicionais (privacy_level, disable_duet, etc.)
     *
     * @return array resposta da API do TikTok
     *
     * @throws \Exception se a publicação falhar
     */
    public function publishVideo(string $videoUrl, string $caption, array $options = []): array
    {
        Log::info("Publicando vídeo no TikTok. URL: {$videoUrl}");

        try {
            // Primeiro, fazer upload do vídeo
            $videoUploadResponse = $this->uploadVideo($videoUrl);

            if (!isset($videoUploadResponse['data']['video_id'])) {
                throw new \Exception('Falha no upload do vídeo para TikTok');
            }

            $videoId = $videoUploadResponse['data']['video_id'];

            // Depois, publicar o vídeo
            $payload = array_merge([
                'video_id' => $videoId,
                'text' => $caption,
                'privacy_level' => 'SELF_ONLY', // PUBLIC_TO_EVERYONE, MUTUAL_FOLLOW_FRIENDS, SELF_ONLY
                'disable_duet' => false,
                'disable_comment' => false,
                'disable_stitch' => false,
                'brand_content_toggle' => false,
                'brand_organic_toggle' => false,
            ], $options);

            $response = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/v2/post/publish/video/init/", $payload);

            if ($response->successful()) {
                $result = $response->json();
                Log::info("Vídeo publicado com sucesso no TikTok.", $result);
                return $result;
            } else {
                Log::error("Falha ao publicar vídeo no TikTok: " . $response->body());
                throw new \Exception("TikTok API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do TikTok: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Faz upload de vídeo para o TikTok.
     *
     * @param string $videoUrl
     * @return array
     */
    protected function uploadVideo(string $videoUrl): array
    {
        try {
            // Primeiro, baixar o vídeo
            $videoResponse = Http::get($videoUrl);
            if (!$videoResponse->successful()) {
                throw new \Exception("Falha ao baixar vídeo: {$videoUrl}");
            }

            $videoContent = $videoResponse->body();
            $videoSize = strlen($videoContent);

            // Inicializar upload
            $initResponse = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/v2/post/publish/video/init/", [
                    'source_info' => [
                        'source' => 'FILE_UPLOAD',
                        'video_size' => $videoSize,
                        'chunk_size' => $videoSize, // Upload em um chunk
                        'total_chunk_count' => 1,
                    ],
                ]);

            if (!$initResponse->successful()) {
                throw new \Exception("TikTok Video Init Error: " . $initResponse->body());
            }

            $initData = $initResponse->json();
            $publishId = $initData['data']['publish_id'];
            $uploadUrl = $initData['data']['upload_url'];

            // Upload do vídeo
            $uploadResponse = Http::withHeaders([
                'Content-Range' => "bytes 0-" . ($videoSize - 1) . "/{$videoSize}",
                'Content-Length' => $videoSize,
            ])->withBody($videoContent, 'video/mp4')->put($uploadUrl);

            if (!$uploadResponse->successful()) {
                throw new \Exception("TikTok Video Upload Error: " . $uploadResponse->body());
            }

            Log::info("Upload de vídeo concluído. Publish ID: {$publishId}");

            return [
                'data' => [
                    'video_id' => $publishId,
                    'publish_id' => $publishId,
                ]
            ];
        } catch (\Exception $e) {
            Log::error("Erro no upload de vídeo para TikTok: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém informações da conta do TikTok.
     *
     * @return array
     */
    public function getUserInfo(): array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/v2/user/info/");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter informações do usuário TikTok: " . $response->body());
                throw new \Exception("TikTok API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao obter informações do usuário TikTok: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém vídeos do usuário.
     *
     * @param array $fields Campos a serem retornados
     * @param int $maxCount Número máximo de vídeos
     *
     * @return array
     */
    public function getUserVideos(array $fields = ['id', 'title', 'video_description'], int $maxCount = 20): array
    {
        try {
            $payload = [
                'max_count' => $maxCount,
                'fields' => $fields,
            ];

            $response = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/v2/video/list/", $payload);

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter vídeos do TikTok: " . $response->body());
                throw new \Exception("TikTok API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao obter vídeos do TikTok: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Verifica a conectividade com a API do TikTok.
     *
     * @return bool
     */
    public function canConnect(): bool
    {
        try {
            $this->getUserInfo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
