<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PinterestService
{
    protected string $baseUrl;
    protected string $accessToken;

    public function __construct()
    {
        $this->baseUrl = config('services.pinterest.base_url', 'https://api.pinterest.com/v5');
        $this->accessToken = config('services.pinterest.access_token');
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
     * Cria um Pin no Pinterest.
     *
     * @param string $imageUrl URL da imagem
     * @param string $description Descrição do Pin
     * @param string|null $link URL de destino
     * @param string|null $boardId ID do board (obrigatório)
     *
     * @return array resposta da API do Pinterest
     *
     * @throws \Exception se a criação falhar
     */
    public function createPin(string $imageUrl, string $description, ?string $link = null, ?string $boardId = null): array
    {
        Log::info("Criando Pin no Pinterest. Imagem: {$imageUrl}");

        try {
            // Board ID é obrigatório no Pinterest
            if (!$boardId) {
                // Tentar obter o primeiro board disponível
                $boards = $this->getBoards();
                if (empty($boards['items'])) {
                    throw new \Exception('Nenhum board encontrado. É necessário ter pelo menos um board para criar Pins.');
                }
                $boardId = $boards['items'][0]['id'];
                Log::info("Usando board padrão: {$boardId}");
            }

            $payload = [
                'link' => $link,
                'title' => substr($description, 0, 100), // Pinterest tem limite de caracteres
                'description' => $description,
                'board_id' => $boardId,
                'media_source' => [
                    'source_type' => 'image_url',
                    'url' => $imageUrl,
                ],
            ];

            // Remover campos nulos
            $payload = array_filter($payload, function ($value) {
                return $value !== null;
            });

            $response = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/pins", $payload);

            if ($response->successful()) {
                Log::info("Pin criado com sucesso no Pinterest.", $response->json());
                return $response->json();
            } else {
                Log::error("Falha ao criar Pin no Pinterest: " . $response->body());
                throw new \Exception("Pinterest API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com a API do Pinterest: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém os boards do usuário.
     *
     * @return array
     */
    public function getBoards(): array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/boards");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter boards do Pinterest: " . $response->body());
                throw new \Exception("Pinterest API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao obter boards do Pinterest: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Cria um novo board.
     *
     * @param string $name Nome do board
     * @param string $description Descrição do board
     * @param string $privacy 'PUBLIC' ou 'SECRET'
     *
     * @return array
     */
    public function createBoard(string $name, string $description = '', string $privacy = 'PUBLIC'): array
    {
        try {
            $payload = [
                'name' => $name,
                'description' => $description,
                'privacy' => $privacy,
            ];

            $response = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/boards", $payload);

            if ($response->successful()) {
                Log::info("Board criado com sucesso no Pinterest: {$name}");
                return $response->json();
            } else {
                Log::error("Falha ao criar board no Pinterest: " . $response->body());
                throw new \Exception("Pinterest API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao criar board no Pinterest: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém informações da conta do Pinterest.
     *
     * @return array
     */
    public function getUserInfo(): array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/user_account");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Falha ao obter informações do usuário Pinterest: " . $response->body());
                throw new \Exception("Pinterest API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao obter informações do usuário Pinterest: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Verifica a conectividade com a API do Pinterest.
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
