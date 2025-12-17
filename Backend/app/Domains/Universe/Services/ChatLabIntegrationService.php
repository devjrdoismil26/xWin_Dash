<?php

namespace App\Domains\Universe\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatLabIntegrationService
{
    protected string $chatLabBaseUrl;

    public function __construct()
    {
        $this->chatLabBaseUrl = config('services.chat_lab.base_url', 'http://localhost:8000'); // Supondo uma configuração em config/services.php
    }

    /**
     * Envia uma mensagem para o ambiente de laboratório de chat.
     *
     * @param string      $message       o conteúdo da mensagem
     * @param string|null $chatSessionId o ID da sessão de chat (opcional)
     *
     * @return array<string, mixed> a resposta do laboratório de chat
     *
     * @throws \Exception se a comunicação com o laboratório de chat falhar
     */
    public function sendMessageToChatLab(string $message, ?string $chatSessionId = null): array
    {
        Log::info("Enviando mensagem para o Chat Lab. Sessão: {$chatSessionId}, Mensagem: {$message}");

        try {
            $response = Http::post("{$this->chatLabBaseUrl}/message", [
                'message' => $message,
                'chat_session_id' => $chatSessionId,
            ]);

            if ($response->successful()) {
                $jsonData = $response->json();
                Log::info("Mensagem enviada com sucesso para o Chat Lab.", $jsonData);
                return is_array($jsonData) ? $jsonData : [];
            } else {
                Log::error("Falha ao enviar mensagem para o Chat Lab: " . $response->body());
                throw new \Exception("Chat Lab API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com o Chat Lab: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém o histórico de chat de uma sessão específica do laboratório de chat.
     *
     * @param string $chatSessionId o ID da sessão de chat
     *
     * @return array<string, mixed> o histórico de chat
     *
     * @throws \Exception se a comunicação com o laboratório de chat falhar
     */
    public function getChatHistory(string $chatSessionId): array
    {
        Log::info("Obtendo histórico de chat para a sessão: {$chatSessionId}.");

        try {
            $response = Http::get("{$this->chatLabBaseUrl}/history/{$chatSessionId}");

            if ($response->successful()) {
                $jsonData = $response->json();
                return is_array($jsonData) ? $jsonData : [];
            } else {
                Log::error("Falha ao obter histórico do Chat Lab: " . $response->body());
                throw new \Exception("Chat Lab API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com o Chat Lab: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Analisa a intenção de geração de mídia em uma mensagem.
     *
     * @param string $message a mensagem para analisar
     * @return array<string, mixed> resultado da análise com intent e confidence
     */
    public function analyzeMediaGenerationIntent(string $message): array
    {
        $message = strtolower($message);
        
        // Palavras-chave para diferentes tipos de mídia
        $imageKeywords = ['imagem', 'foto', 'picture', 'image', 'desenho', 'ilustração', 'gera uma imagem'];
        $videoKeywords = ['vídeo', 'video', 'filme', 'movie', 'anima', 'cria um vídeo'];
        
        $imageScore = 0;
        $videoScore = 0;
        
        foreach ($imageKeywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                $imageScore += 1;
            }
        }
        
        foreach ($videoKeywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                $videoScore += 1;
            }
        }
        
        if ($imageScore > $videoScore) {
            return [
                'intent' => 'image',
                'confidence' => min(0.9, 0.5 + ($imageScore * 0.2))
            ];
        } elseif ($videoScore > $imageScore) {
            return [
                'intent' => 'video',
                'confidence' => min(0.9, 0.5 + ($videoScore * 0.2))
            ];
        }
        
        return [
            'intent' => 'text',
            'confidence' => 0.3
        ];
    }
}
