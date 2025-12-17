<?php

namespace App\Domains\Aura\Services;

use App\Domains\AI\Services\AIService;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;
use Illuminate\Support\Facades\Log;

/**
 * Serviço de IA especializado para o módulo AURA
 * Integra capacidades de IA com fluxos conversacionais do WhatsApp
 */
class AuraAIService
{
    public function __construct(
        private readonly AIService $aiService,
        private readonly AuraChatModel $chatModel,
        private readonly AuraFlowModel $flowModel
    ) {
    }

    /**
     * Analisa uma mensagem recebida e determina a intenção do usuário
     *
     * @param string $message Mensagem do usuário
     * @param string $context Contexto da conversa
     * @return array{intent: string, confidence: float, entities: array, response_suggestion: string}
     */
    public function analyzeMessageIntent(string $message, string $context = ''): array
    {
        try {
            $prompt = $this->buildIntentAnalysisPrompt($message, $context);
            $aiResponse = $this->aiService->generateText($prompt, 'gemini-pro');

            return $this->parseIntentResponse($aiResponse);
        } catch (\Exception $e) {
            Log::error('Erro ao analisar intenção da mensagem', [
                'message' => $message,
                'error' => $e->getMessage()
            ]);

            return [
                'intent' => 'unknown',
                'confidence' => 0.0,
                'entities' => [],
                'response_suggestion' => 'Desculpe, não consegui entender sua mensagem. Pode reformular?'
            ];
        }
    }

    /**
     * Gera uma resposta automática para o usuário baseada no contexto
     *
     * @param string $userMessage Mensagem do usuário
     * @param string $intent Intenção identificada
     * @param array $chatHistory Histórico da conversa
     * @return array{response: string, next_action: string|null, flow_suggestion: string|null}
     */
    public function generateAutomaticResponse(string $userMessage, string $intent, array $chatHistory = []): array
    {
        try {
            $prompt = $this->buildResponseGenerationPrompt($userMessage, $intent, $chatHistory);
            $aiResponse = $this->aiService->generateText($prompt, 'claude-3-sonnet');

            return $this->parseResponseGeneration($aiResponse);
        } catch (\Exception $e) {
            Log::error('Erro ao gerar resposta automática', [
                'user_message' => $userMessage,
                'intent' => $intent,
                'error' => $e->getMessage()
            ]);

            return [
                'response' => 'Obrigado pela sua mensagem! Um de nossos atendentes entrará em contato em breve.',
                'next_action' => 'transfer_to_human',
                'flow_suggestion' => null
            ];
        }
    }

    /**
     * Sugere o melhor fluxo para um usuário baseado em seu perfil e histórico
     *
     * @param string $phoneNumber Número do WhatsApp
     * @param array $userProfile Perfil do usuário
     * @return array{flow_id: string|null, flow_name: string|null, confidence: float, reason: string}
     */
    public function suggestOptimalFlow(string $phoneNumber, array $userProfile = []): array
    {
        try {
            // Buscar histórico de conversas do usuário
            $chatHistory = $this->chatModel
                ->where('phone_number', $phoneNumber)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->toArray();

            // Buscar fluxos disponíveis
            $availableFlows = $this->flowModel
                ->where('is_active', true)
                ->get(['id', 'name', 'description', 'conditions'])
                ->toArray();

            $prompt = $this->buildFlowSuggestionPrompt($phoneNumber, $userProfile, $chatHistory, $availableFlows);
            $aiResponse = $this->aiService->generateText($prompt, 'gemini-pro');

            return $this->parseFlowSuggestion($aiResponse, $availableFlows);
        } catch (\Exception $e) {
            Log::error('Erro ao sugerir fluxo ótimo', [
                'phone_number' => $phoneNumber,
                'error' => $e->getMessage()
            ]);

            return [
                'flow_id' => null,
                'flow_name' => null,
                'confidence' => 0.0,
                'reason' => 'Erro ao analisar perfil do usuário'
            ];
        }
    }

    /**
     * Analisa o sentimento de uma conversa completa
     *
     * @param string $chatId ID do chat
     * @return array{sentiment: string, score: float, emotions: array, summary: string}
     */
    public function analyzeChatSentiment(string $chatId): array
    {
        try {
            $chat = $this->chatModel->find($chatId);
            if (!$chat) {
                throw new \RuntimeException('Chat não encontrado');
            }

            // Buscar mensagens do chat
            $messages = $chat->messages ?? [];
            $conversationText = collect($messages)->pluck('content')->join(' ');

            $prompt = $this->buildSentimentAnalysisPrompt($conversationText);
            $aiResponse = $this->aiService->generateText($prompt, 'claude-3-sonnet');

            return $this->parseSentimentAnalysis($aiResponse);
        } catch (\Exception $e) {
            Log::error('Erro ao analisar sentimento do chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);

            return [
                'sentiment' => 'neutral',
                'score' => 0.5,
                'emotions' => ['neutral'],
                'summary' => 'Não foi possível analisar o sentimento da conversa'
            ];
        }
    }

    /**
     * Gera sugestões de melhoria para um fluxo baseado em métricas
     *
     * @param string $flowId ID do fluxo
     * @param array $metrics Métricas do fluxo
     * @return array{suggestions: array, priority: string, estimated_improvement: string}
     */
    public function generateFlowOptimizationSuggestions(string $flowId, array $metrics): array
    {
        try {
            $flow = $this->flowModel->find($flowId);
            if (!$flow) {
                throw new \RuntimeException('Fluxo não encontrado');
            }

            $prompt = $this->buildFlowOptimizationPrompt($flow->toArray(), $metrics);
            $aiResponse = $this->aiService->generateText($prompt, 'gemini-pro');

            return $this->parseFlowOptimization($aiResponse);
        } catch (\Exception $e) {
            Log::error('Erro ao gerar sugestões de otimização', [
                'flow_id' => $flowId,
                'error' => $e->getMessage()
            ]);

            return [
                'suggestions' => ['Revise manualmente as métricas do fluxo'],
                'priority' => 'medium',
                'estimated_improvement' => 'Melhoria estimada não disponível'
            ];
        }
    }

    // Métodos privados para construção de prompts

    private function buildIntentAnalysisPrompt(string $message, string $context): string
    {
        return "Analise a seguinte mensagem de WhatsApp e determine a intenção do usuário.

Mensagem: \"{$message}\"
Contexto: {$context}

Retorne um JSON com:
- intent: (support, sales, information, complaint, greeting, goodbye, other)
- confidence: (0.0 a 1.0)
- entities: array de entidades extraídas (nomes, produtos, datas, etc.)
- response_suggestion: sugestão de resposta apropriada

Seja preciso e considere o contexto brasileiro/português.";
    }

    private function parseIntentResponse(string $aiResponse): array
    {
        // Tentar extrair JSON da resposta da IA
        try {
            $decoded = json_decode($aiResponse, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return [
                    'intent' => $decoded['intent'] ?? 'unknown',
                    'confidence' => (float) ($decoded['confidence'] ?? 0.5),
                    'entities' => $decoded['entities'] ?? [],
                    'response_suggestion' => $decoded['response_suggestion'] ?? ''
                ];
            }
        } catch (\Exception $e) {
            // Fallback parsing
        }

        // Fallback: análise simples baseada em palavras-chave
        return $this->fallbackIntentAnalysis($aiResponse);
    }

    private function buildResponseGenerationPrompt(string $userMessage, string $intent, array $chatHistory): string
    {
        $historyText = empty($chatHistory) ? 'Nenhum histórico' :
            collect($chatHistory)->map(fn($msg) => "{$msg['sender']}: {$msg['content']}")->join("\n");

        return "Gere uma resposta natural e útil para o usuário no WhatsApp.

Mensagem do usuário: \"{$userMessage}\"
Intenção detectada: {$intent}
Histórico da conversa:
{$historyText}

Retorne um JSON com:
- response: resposta amigável e útil
- next_action: (continue_flow, transfer_to_human, end_conversation, collect_info)
- flow_suggestion: ID ou nome do fluxo recomendado (se aplicável)

Use tom conversacional, seja prestativo e mantenha o contexto brasileiro.";
    }

    private function parseResponseGeneration(string $aiResponse): array
    {
        try {
            $decoded = json_decode($aiResponse, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return [
                    'response' => $decoded['response'] ?? 'Obrigado pela mensagem!',
                    'next_action' => $decoded['next_action'] ?? 'continue_flow',
                    'flow_suggestion' => $decoded['flow_suggestion'] ?? null
                ];
            }
        } catch (\Exception $e) {
            // Fallback
        }

        return [
            'response' => $aiResponse ?: 'Como posso ajudá-lo hoje?',
            'next_action' => 'continue_flow',
            'flow_suggestion' => null
        ];
    }

    private function buildFlowSuggestionPrompt(string $phoneNumber, array $userProfile, array $chatHistory, array $availableFlows): string
    {
        $flowsText = collect($availableFlows)->map(fn($flow) =>
            "- {$flow['id']}: {$flow['name']} - {$flow['description']}")->join("\n");

        $historyText = empty($chatHistory) ? 'Nenhum histórico' :
            collect($chatHistory)->map(fn($chat) => $chat['content'])->join(' ');

        return "Analise o perfil e histórico do usuário para sugerir o melhor fluxo de atendimento.

Usuário: {$phoneNumber}
Perfil: " . json_encode($userProfile) . "
Histórico recente: {$historyText}

Fluxos disponíveis:
{$flowsText}

Retorne JSON com:
- flow_id: ID do fluxo recomendado
- confidence: confiança na recomendação (0.0-1.0)
- reason: explicação da escolha";
    }

    private function parseFlowSuggestion(string $aiResponse, array $availableFlows): array
    {
        try {
            $decoded = json_decode($aiResponse, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $flowId = $decoded['flow_id'] ?? null;
                $flow = collect($availableFlows)->firstWhere('id', $flowId);

                return [
                    'flow_id' => $flowId,
                    'flow_name' => $flow['name'] ?? null,
                    'confidence' => (float) ($decoded['confidence'] ?? 0.5),
                    'reason' => $decoded['reason'] ?? 'Sugestão baseada em análise de IA'
                ];
            }
        } catch (\Exception $e) {
            // Fallback
        }

        // Default: sugerir primeiro fluxo ativo se disponível
        $defaultFlow = $availableFlows[0] ?? null;
        return [
            'flow_id' => $defaultFlow['id'] ?? null,
            'flow_name' => $defaultFlow['name'] ?? null,
            'confidence' => 0.3,
            'reason' => 'Fluxo padrão sugerido'
        ];
    }

    private function buildSentimentAnalysisPrompt(string $conversationText): string
    {
        return "Analise o sentimento da seguinte conversa de WhatsApp:

Conversa: \"{$conversationText}\"

Retorne um JSON com:
- sentiment: (positive, negative, neutral)
- score: pontuação de -1.0 (muito negativo) a 1.0 (muito positivo)
- emotions: array de emoções detectadas (happy, angry, frustrated, satisfied, confused, etc.)
- summary: resumo do tom geral da conversa

Considere o contexto brasileiro e seja preciso na análise.";
    }

    private function parseSentimentAnalysis(string $aiResponse): array
    {
        try {
            $decoded = json_decode($aiResponse, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return [
                    'sentiment' => $decoded['sentiment'] ?? 'neutral',
                    'score' => (float) ($decoded['score'] ?? 0.0),
                    'emotions' => $decoded['emotions'] ?? ['neutral'],
                    'summary' => $decoded['summary'] ?? 'Análise de sentimento concluída'
                ];
            }
        } catch (\Exception $e) {
            // Fallback
        }

        return [
            'sentiment' => 'neutral',
            'score' => 0.0,
            'emotions' => ['neutral'],
            'summary' => 'Análise básica: tom neutro detectado'
        ];
    }

    private function buildFlowOptimizationPrompt(array $flow, array $metrics): string
    {
        return "Analise o fluxo conversacional e suas métricas para sugerir otimizações:

Fluxo: " . json_encode($flow) . "
Métricas: " . json_encode($metrics) . "

Retorne JSON com:
- suggestions: array de sugestões específicas de melhoria
- priority: (high, medium, low)
- estimated_improvement: descrição do impacto esperado

Foque em conversão, engagement e experiência do usuário.";
    }

    private function parseFlowOptimization(string $aiResponse): array
    {
        try {
            $decoded = json_decode($aiResponse, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return [
                    'suggestions' => $decoded['suggestions'] ?? ['Revisar pontos de fricção no fluxo'],
                    'priority' => $decoded['priority'] ?? 'medium',
                    'estimated_improvement' => $decoded['estimated_improvement'] ?? 'Melhoria moderada esperada'
                ];
            }
        } catch (\Exception $e) {
            // Fallback
        }

        return [
            'suggestions' => ['Analisar métricas de conversão', 'Otimizar tempo de resposta'],
            'priority' => 'medium',
            'estimated_improvement' => 'Potencial de melhoria na experiência do usuário'
        ];
    }

    private function fallbackIntentAnalysis(string $response): array
    {
        // Análise simples baseada em palavras-chave
        $message = strtolower($response);

        if (str_contains($message, 'olá') || str_contains($message, 'oi')) {
            return ['intent' => 'greeting', 'confidence' => 0.8, 'entities' => [], 'response_suggestion' => 'Olá! Como posso ajudá-lo hoje?'];
        }

        if (str_contains($message, 'problema') || str_contains($message, 'erro')) {
            return ['intent' => 'support', 'confidence' => 0.7, 'entities' => [], 'response_suggestion' => 'Entendo que está enfrentando um problema. Pode me dar mais detalhes?'];
        }

        if (str_contains($message, 'comprar') || str_contains($message, 'preço')) {
            return ['intent' => 'sales', 'confidence' => 0.7, 'entities' => [], 'response_suggestion' => 'Fico feliz em ajudá-lo com informações sobre nossos produtos!'];
        }

        return ['intent' => 'information', 'confidence' => 0.5, 'entities' => [], 'response_suggestion' => 'Como posso ajudá-lo hoje?'];
    }
}
