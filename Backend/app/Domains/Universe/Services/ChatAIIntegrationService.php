<?php

namespace App\Domains\Universe\Services;

use App\Domains\AI\Services\AIService;
use App\Domains\Aura\Services\AuraChatService;
use Illuminate\Support\Facades\Log;

class ChatAIIntegrationService
{
    protected AIService $aiService;

    protected AuraChatService $auraChatService;

    public function __construct(AIService $aiService, AuraChatService $auraChatService)
    {
        $this->aiService = $aiService;
        $this->auraChatService = $auraChatService;
    }

    /**
     * Gera uma resposta de IA para uma mensagem de chat.
     *
     * @param string $chatSessionId o ID da sessão de chat
     * @param string $message       o conteúdo da mensagem do usuário
     *
     * @return string a resposta gerada pela IA
     *
     * @throws \Exception se a geração da resposta falhar
     */
    public function generateAIResponseForChat(string $chatSessionId, string $message): string
    {
        Log::info("Gerando resposta de IA para sessão de chat: {$chatSessionId}. Mensagem: {$message}");

        try {
            // Obter histórico do chat para contexto (opcional)
            $chatHistory = $this->auraChatService->getChatHistory($chatSessionId);

            // Construir prompt com histórico se disponível
            $prompt = "Com base no histórico do chat e na última mensagem: \"{$message}\", gere uma resposta concisa e útil.";
            if (!empty($chatHistory)) {
                $historyText = array_reduce($chatHistory, function($carry, $msg) {
                    $role = $msg['role'] ?? 'user';
                    $content = $msg['content'] ?? $msg['message'] ?? '';
                    return $carry . "\n{$role}: {$content}";
                }, 'Histórico do chat:');
                $prompt = $historyText . "\n\nÚltima mensagem: \"{$message}\"\n\nGere uma resposta concisa e útil baseada no contexto acima.";
            }

            $aiResponse = $this->aiService->generateText($prompt, 'gemini-pro', 'gemini');

            Log::info("Resposta de IA gerada para sessão de chat: {$chatSessionId}.");
            return $aiResponse;
        } catch (\Exception $e) {
            Log::error("Falha ao gerar resposta de IA para chat: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Analisa o sentimento de uma mensagem de chat.
     *
     * @param string $message o conteúdo da mensagem
     *
     * @return array<string, mixed> o resultado da análise de sentimento (ex: 'positive', 'negative', 'neutral')
     *
     * @throws \Exception se a análise falhar
     */
    public function analyzeChatSentiment(string $message): array
    {
        Log::info("Analisando sentimento da mensagem de chat: {$message}");

        try {
            // Criar prompt para análise de sentimento
            $prompt = "Analise o sentimento da seguinte mensagem e retorne apenas um JSON com o formato exato: {\"sentiment\": \"positive|negative|neutral\", \"confidence\": 0.0-1.0, \"reason\": \"breve explicação\"}. Mensagem: \"{$message}\"";

            // Usar IA real para análise de sentimento
            $aiResponse = $this->aiService->generateText($prompt, 'gpt-3.5-turbo', 'openai');

            // Tentar parsear a resposta JSON
            $parsedResponse = $this->parseAISentimentResponse($aiResponse, $message);

            Log::info("Sentimento da mensagem analisado: " . json_encode($parsedResponse));
            return $parsedResponse;
        } catch (\Exception $e) {
            Log::error("Falha ao analisar sentimento da mensagem de chat: " . $e->getMessage());

            // Fallback para análise básica se IA falhar
            return $this->basicSentimentAnalysis($message);
        }
    }

    /**
     * Parseia a resposta da IA para análise de sentimento.
     */
    protected function parseAISentimentResponse(string $aiResponse, string $originalMessage): array
    {
        // Tentar extrair JSON da resposta
        $jsonStart = strpos($aiResponse, '{');
        $jsonEnd = strrpos($aiResponse, '}');

        if ($jsonStart !== false && $jsonEnd !== false) {
            $jsonString = substr($aiResponse, $jsonStart, $jsonEnd - $jsonStart + 1);
            $parsed = json_decode($jsonString, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($parsed['sentiment'])) {
                return [
                    'sentiment' => $parsed['sentiment'],
                    'confidence' => $parsed['confidence'] ?? 0.8,
                    'reason' => $parsed['reason'] ?? 'Análise via IA',
                    'message' => $originalMessage,
                    'raw_response' => $aiResponse
                ];
            }
        }

        // Se não conseguir parsear, usar análise básica
        return $this->basicSentimentAnalysis($originalMessage);
    }

    /**
     * Análise básica de sentimento como fallback.
     */
    protected function basicSentimentAnalysis(string $message): array
    {
        $message = strtolower($message);

        // Palavras positivas
        $positiveWords = ['obrigado', 'excelente', 'ótimo', 'bom', 'perfeito', 'adorei', 'gostei', 'parabéns', 'sucesso'];
        $positiveCount = 0;
        foreach ($positiveWords as $word) {
            if (str_contains($message, $word)) {
                $positiveCount++;
            }
        }

        // Palavras negativas
        $negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'falha', 'odeio', 'terrível', 'decepcionado'];
        $negativeCount = 0;
        foreach ($negativeWords as $word) {
            if (str_contains($message, $word)) {
                $negativeCount++;
            }
        }

        // Determinar sentimento
        if ($positiveCount > $negativeCount) {
            $sentiment = 'positive';
            $confidence = min(0.6 + ($positiveCount * 0.1), 0.9);
        } elseif ($negativeCount > $positiveCount) {
            $sentiment = 'negative';
            $confidence = min(0.6 + ($negativeCount * 0.1), 0.9);
        } else {
            $sentiment = 'neutral';
            $confidence = 0.5;
        }

        return [
            'sentiment' => $sentiment,
            'confidence' => $confidence,
            'reason' => 'Análise básica baseada em palavras-chave',
            'message' => $message,
            'method' => 'fallback'
        ];
    }
}
