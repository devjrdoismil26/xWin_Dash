<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\GeminiApiException;
use App\Domains\AI\Exceptions\PyLabException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para chat inteligente
 *
 * Responsável por processar conversas inteligentes,
 * incluindo análise de contexto e respostas personalizadas.
 */
class AIChatService
{
    protected GeminiService $geminiService;
    protected AIProviderManager $providerManager;

    public function __construct(
        GeminiService $geminiService,
        AIProviderManager $providerManager
    ) {
        $this->geminiService = $geminiService;
        $this->providerManager = $providerManager;
    }

    /**
     * Processa uma conversa inteligente com análise de contexto
     */
    public function intelligentChat(string $message, array $context = [], ?int $userId = null): array
    {
        try {
            // Analisar contexto da conversa
            $contextAnalysis = $this->analyzeConversationContext($message, $context);

            // Determinar a melhor estratégia de resposta
            $responseStrategy = $this->determineResponseStrategy($contextAnalysis);

            // Gerar resposta baseada na estratégia
            $response = $this->generateContextualResponse($message, $contextAnalysis, $responseStrategy, $userId);

            // Adicionar metadados da conversa
            $response['metadata'] = [
                'context_analysis' => $contextAnalysis,
                'response_strategy' => $responseStrategy,
                'timestamp' => now(),
                'user_id' => $userId,
                'conversation_id' => $context['conversation_id'] ?? null
            ];

            return $response;
        } catch (\Throwable $exception) {
            Log::error('Erro no chat inteligente', [
                'error' => $exception->getMessage(),
                'message' => $message,
                'context' => $context,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno no processamento da conversa',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Analisa o contexto da conversa
     */
    private function analyzeConversationContext(string $message, array $context): array
    {
        $cacheKey = "context_analysis_" . md5($message . serialize($context));

        return Cache::remember($cacheKey, 300, function () use ($message, $context) {
            $analysis = [
                'intent' => $this->detectIntent($message),
                'sentiment' => $this->analyzeSentiment($message),
                'entities' => $this->extractEntities($message),
                'topics' => $this->extractTopics($message),
                'urgency' => $this->assessUrgency($message),
                'complexity' => $this->assessComplexity($message),
                'language' => $this->detectLanguage($message),
                'previous_context' => $context['previous_messages'] ?? [],
                'user_preferences' => $context['user_preferences'] ?? [],
                'domain_knowledge' => $context['domain_knowledge'] ?? []
            ];

            return $analysis;
        });
    }

    /**
     * Detecta a intenção da mensagem
     */
    private function detectIntent(string $message): string
    {
        $intents = [
            'question' => ['?', 'como', 'quando', 'onde', 'por que', 'o que', 'qual'],
            'request' => ['pode', 'poderia', 'gostaria', 'preciso', 'quero'],
            'complaint' => ['problema', 'erro', 'não funciona', 'bug', 'falha'],
            'compliment' => ['obrigado', 'muito bom', 'excelente', 'perfeito'],
            'greeting' => ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
            'goodbye' => ['tchau', 'até logo', 'até mais', 'adeus']
        ];

        $message = strtolower($message);

        foreach ($intents as $intent => $keywords) {
            foreach ($keywords as $keyword) {
                if (strpos($message, $keyword) !== false) {
                    return $intent;
                }
            }
        }

        return 'general';
    }

    /**
     * Analisa o sentimento da mensagem
     */
    private function analyzeSentiment(string $message): string
    {
        $positiveWords = ['bom', 'ótimo', 'excelente', 'perfeito', 'maravilhoso', 'incrível'];
        $negativeWords = ['ruim', 'terrível', 'horrível', 'péssimo', 'problema', 'erro'];

        $message = strtolower($message);
        $positiveCount = 0;
        $negativeCount = 0;

        foreach ($positiveWords as $word) {
            if (strpos($message, $word) !== false) {
                $positiveCount++;
            }
        }

        foreach ($negativeWords as $word) {
            if (strpos($message, $word) !== false) {
                $negativeCount++;
            }
        }

        if ($positiveCount > $negativeCount) {
            return 'positive';
        } elseif ($negativeCount > $positiveCount) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }

    /**
     * Extrai entidades da mensagem
     */
    private function extractEntities(string $message): array
    {
        // Implementar extração de entidades usando IA
        // Por enquanto, retorna entidades básicas
        $entities = [];

        // Detectar números
        if (preg_match_all('/\d+/', $message, $matches)) {
            $entities['numbers'] = $matches[0];
        }

        // Detectar emails
        if (preg_match_all('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $message, $matches)) {
            $entities['emails'] = $matches[0];
        }

        // Detectar URLs
        if (preg_match_all('/https?:\/\/[^\s]+/', $message, $matches)) {
            $entities['urls'] = $matches[0];
        }

        return $entities;
    }

    /**
     * Extrai tópicos da mensagem
     */
    private function extractTopics(string $message): array
    {
        $topics = [];
        $message = strtolower($message);

        $topicKeywords = [
            'tecnologia' => ['tecnologia', 'tech', 'software', 'programação', 'código'],
            'negócios' => ['negócio', 'empresa', 'vendas', 'marketing', 'cliente'],
            'suporte' => ['suporte', 'ajuda', 'problema', 'erro', 'bug'],
            'produto' => ['produto', 'serviço', 'funcionalidade', 'recurso'],
            'financeiro' => ['preço', 'custo', 'pagamento', 'fatura', 'cobrança']
        ];

        foreach ($topicKeywords as $topic => $keywords) {
            foreach ($keywords as $keyword) {
                if (strpos($message, $keyword) !== false) {
                    $topics[] = $topic;
                    break;
                }
            }
        }

        return array_unique($topics);
    }

    /**
     * Avalia a urgência da mensagem
     */
    private function assessUrgency(string $message): string
    {
        $urgentKeywords = ['urgente', 'emergência', 'crítico', 'imediato', 'agora'];
        $message = strtolower($message);

        foreach ($urgentKeywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                return 'high';
            }
        }

        return 'normal';
    }

    /**
     * Avalia a complexidade da mensagem
     */
    private function assessComplexity(string $message): string
    {
        $wordCount = str_word_count($message);
        $sentenceCount = substr_count($message, '.') + substr_count($message, '!') + substr_count($message, '?');

        if ($wordCount > 50 || $sentenceCount > 3) {
            return 'high';
        } elseif ($wordCount > 20 || $sentenceCount > 1) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * Detecta o idioma da mensagem
     */
    private function detectLanguage(string $message): string
    {
        // Implementar detecção de idioma
        // Por enquanto, assume português
        return 'pt';
    }

    /**
     * Determina a estratégia de resposta
     */
    private function determineResponseStrategy(array $contextAnalysis): string
    {
        $intent = $contextAnalysis['intent'];
        $sentiment = $contextAnalysis['sentiment'];
        $urgency = $contextAnalysis['urgency'];
        $complexity = $contextAnalysis['complexity'];

        // Estratégias baseadas no contexto
        if ($urgency === 'high') {
            return 'immediate_response';
        }

        if ($sentiment === 'negative') {
            return 'empathetic_response';
        }

        if ($complexity === 'high') {
            return 'detailed_response';
        }

        if ($intent === 'question') {
            return 'informative_response';
        }

        if ($intent === 'complaint') {
            return 'problem_solving_response';
        }

        return 'general_response';
    }

    /**
     * Gera resposta contextual
     */
    private function generateContextualResponse(string $message, array $contextAnalysis, string $strategy, ?int $userId): array
    {
        try {
            // Construir prompt contextual
            $contextualPrompt = $this->buildContextualPrompt($message, $contextAnalysis, $strategy);

            // Gerar resposta usando Gemini
            $response = $this->geminiService->generateText($contextualPrompt, 'gemini-1.5-pro', $userId);

            // Processar resposta baseada na estratégia
            $processedResponse = $this->processResponseByStrategy($response, $strategy, $contextAnalysis);

            return [
                'success' => true,
                'response' => $processedResponse,
                'strategy_used' => $strategy,
                'context_considered' => true
            ];
        } catch (GeminiApiException $e) {
            Log::error('Erro na geração de resposta contextual', [
                'error' => $e->getMessage(),
                'strategy' => $strategy
            ]);

            return [
                'success' => false,
                'error' => 'Erro na geração da resposta',
                'fallback_response' => 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente.'
            ];
        }
    }

    /**
     * Constrói prompt contextual
     */
    private function buildContextualPrompt(string $message, array $contextAnalysis, string $strategy): string
    {
        $prompt = "Você é um assistente de IA inteligente. ";

        // Adicionar contexto baseado na estratégia
        switch ($strategy) {
            case 'immediate_response':
                $prompt .= "Responda de forma rápida e direta. ";
                break;
            case 'empathetic_response':
                $prompt .= "Seja empático e compreensivo. ";
                break;
            case 'detailed_response':
                $prompt .= "Forneça uma resposta detalhada e completa. ";
                break;
            case 'informative_response':
                $prompt .= "Forneça informações claras e úteis. ";
                break;
            case 'problem_solving_response':
                $prompt .= "Foque em resolver o problema apresentado. ";
                break;
            default:
                $prompt .= "Responda de forma natural e útil. ";
        }

        // Adicionar contexto da análise
        if (!empty($contextAnalysis['topics'])) {
            $prompt .= "Tópicos identificados: " . implode(', ', $contextAnalysis['topics']) . ". ";
        }

        if (!empty($contextAnalysis['entities'])) {
            $prompt .= "Entidades mencionadas: " . json_encode($contextAnalysis['entities']) . ". ";
        }

        $prompt .= "Mensagem do usuário: {$message}";

        return $prompt;
    }

    /**
     * Processa resposta baseada na estratégia
     */
    private function processResponseByStrategy(array $response, string $strategy, array $contextAnalysis): array
    {
        $processedResponse = $response;

        // Adicionar elementos específicos baseados na estratégia
        switch ($strategy) {
            case 'empathetic_response':
                $processedResponse['tone'] = 'empático';
                break;
            case 'detailed_response':
                $processedResponse['detail_level'] = 'alto';
                break;
            case 'immediate_response':
                $processedResponse['response_time'] = 'rápido';
                break;
        }

        // Adicionar sugestões de follow-up se apropriado
        if ($contextAnalysis['complexity'] === 'high') {
            $processedResponse['follow_up_suggestions'] = [
                'Precisa de mais detalhes?',
                'Quer que eu explique melhor algum ponto?',
                'Tem alguma dúvida específica?'
            ];
        }

        return $processedResponse;
    }
}
