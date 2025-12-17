<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LinkedInService
{
    protected string $baseUrl;

    protected string $accessToken;

    protected ?string $personId = null;

    public function __construct()
    {
        $this->baseUrl = config('services.linkedin.base_url', 'https://api.linkedin.com/v2');
        $this->accessToken = config('services.linkedin.access_token'); // Ou obtido dinamicamente
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
     * Define o ID da pessoa/organização do LinkedIn.
     *
     * @param string $personId
     */
    public function setPersonId(string $personId): void
    {
        $this->personId = $personId;
    }

    /**
     * Publica um post no LinkedIn.
     *
     * @param string $message   o conteúdo do post
     * @param array  $mediaUrls URLs das mídias a serem anexadas
     *
     * @return array resposta da API do LinkedIn
     *
     * @throws \Exception se a publicação falhar
     */
    public function publishPost(string $message, array $mediaUrls = []): array
    {
        Log::info("Publicando post no LinkedIn. Conteúdo: {$message}");

        try {
            $authorUrn = 'urn:li:person:' . ($this->personId ?? config('services.linkedin.person_id'));

            $postData = [
                'author' => $authorUrn,
                'lifecycleState' => 'PUBLISHED',
                'specificContent' => [
                    'com.linkedin.ugc.ShareContent' => [
                        'shareCommentary' => [
                            'text' => $message,
                        ],
                        'shareMediaCategory' => empty($mediaUrls) ? 'NONE' : 'IMAGE',
                    ],
                ],
                'visibility' => [
                    'com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC',
                ],
            ];

            // Adicionar mídia se fornecida
            if (!empty($mediaUrls)) {
                $media = [];
                foreach ($mediaUrls as $mediaUrl) {
                    try {
                        // Para LinkedIn, precisamos primeiro registrar o upload e depois fazer upload da imagem
                        $assetId = $this->uploadMedia($mediaUrl, $authorUrn);
                        $media[] = [
                            'status' => 'READY',
                            'description' => [
                                'text' => $message,
                            ],
                            'media' => $assetId,
                            'title' => [
                                'text' => 'Shared Media',
                            ],
                        ];
                    } catch (\Exception $e) {
                        Log::warning("Falha ao fazer upload de mídia para LinkedIn: " . $e->getMessage());
                        // Continuar sem a mídia em caso de erro
                    }
                }

                if (!empty($media)) {
                    $postData['specificContent']['com.linkedin.ugc.ShareContent']['media'] = $media;
                }
            }

            $response = Http::withToken($this->accessToken)
                            ->withHeaders(['Content-Type' => 'application/json'])
                            ->post("{$this->baseUrl}/ugcPosts", $postData);

            if ($response->successful()) {
                Log::info("Post publicado com sucesso no LinkedIn.", $response->json());
                return $response->json();
            } else {
                Log::error("Falha ao publicar post no LinkedIn: " . $response->body());
                throw new \Exception("LinkedIn API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do LinkedIn: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Faz upload de mídia para o LinkedIn.
     *
     * @param string $mediaUrl URL da mídia para upload
     * @param string $authorUrn URN do autor
     *
     * @return string URN do asset no LinkedIn
     *
     * @throws \Exception se o upload falhar
     */
    public function uploadMedia(string $mediaUrl, string $authorUrn): string
    {
        Log::info("Fazendo upload de mídia para LinkedIn: {$mediaUrl}");

        try {
            // Passo 1: Registrar upload de mídia
            $registerResponse = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/assets?action=registerUpload", [
                    'registerUploadRequest' => [
                        'recipes' => ['urn:li:digitalmediaRecipe:feedshare-image'],
                        'owner' => $authorUrn,
                        'serviceRelationships' => [
                            [
                                'relationshipType' => 'OWNER',
                                'identifier' => 'urn:li:userGeneratedContent',
                            ],
                        ],
                    ],
                ]);

            if (!$registerResponse->successful()) {
                throw new \Exception("LinkedIn Media Register Error: " . $registerResponse->body());
            }

            $registerData = $registerResponse->json();
            $assetId = $registerData['value']['asset'];
            $uploadUrl = $registerData['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl'];

            // Passo 2: Download da mídia
            $mediaResponse = Http::get($mediaUrl);
            if (!$mediaResponse->successful()) {
                throw new \Exception("Falha ao baixar mídia: {$mediaUrl}");
            }

            // Passo 3: Upload da mídia
            $uploadResponse = Http::withHeaders([
                'Content-Type' => 'application/octet-stream',
            ])->withBody($mediaResponse->body())->post($uploadUrl);

            if ($uploadResponse->successful()) {
                Log::info("Upload de mídia concluído. Asset ID: {$assetId}");
                return $assetId;
            } else {
                throw new \Exception("LinkedIn Media Upload Error: " . $uploadResponse->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro no upload de mídia para LinkedIn: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém informações da conta do LinkedIn.
     *
     * @return array resposta da API do LinkedIn
     *
     * @throws \Exception se a requisição falhar
     */
    public function getAccountInfo(): array
    {
        Log::info("Obtendo informações da conta do LinkedIn.");

        try {
            $response = Http::withToken($this->accessToken)
                            ->get("{$this->baseUrl}/me");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter informações da conta do LinkedIn: " . $response->body());
                throw new \Exception("LinkedIn API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do LinkedIn: " . $e->getMessage());
            throw $e;
        }
    }
}
