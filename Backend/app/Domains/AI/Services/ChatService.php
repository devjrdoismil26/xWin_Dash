<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Services\OpenAIService;
use App\Domains\AI\Services\ClaudeService;
use App\Domains\AI\Services\GeminiService;
use App\Domains\AI\Models\ChatSession;
use App\Domains\AI\Models\ChatMessage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Chat Service - Implementação completa para processamento de mensagens
 */
class ChatService
{
    public function __construct(
        private OpenAIService $openAIService,
        private ClaudeService $claudeService,
        private GeminiService $geminiService
    ) {
    }

    /**
     * Processa uma mensagem do usuário
     */
    public function processMessage(string $message, int $userId, ?string $sessionId = null): array
    {
        try {
            // Buscar ou criar sessão de chat
            $session = $this->getOrCreateSession($userId, $sessionId);

            // Salvar mensagem do usuário
            $userMessage = $this->saveMessage($session->id, $message, 'user', $userId);

            // Determinar qual serviço de IA usar
            $aiService = $this->selectAIService($session);

            // Processar mensagem com IA
            $aiResponse = $this->processWithAI($message, $session, $aiService);

            // Salvar resposta da IA
            $aiMessage = $this->saveMessage($session->id, $aiResponse['content'], 'assistant', $userId);

            // Atualizar sessão
            $session->update([
                'last_message_at' => now(),
                'message_count' => $session->message_count + 2
            ]);

            return [
                'success' => true,
                'message' => 'Message processed successfully',
                'response' => $aiResponse['content'],
                'session_id' => $session->id,
                'message_id' => $aiMessage->id,
                'tokens_used' => $aiResponse['tokens_used'] ?? 0,
                'processing_time' => $aiResponse['processing_time'] ?? 0
            ];
        } catch (\Exception $e) {
            Log::error('Error processing chat message', [
                'user_id' => $userId,
                'message' => $message,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Error processing message',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Obtém histórico de conversas
     */
    public function getConversationHistory(int $userId, ?string $sessionId = null): array
    {
        try {
            $query = ChatMessage::where('user_id', $userId)
                ->with('session')
                ->orderBy('created_at', 'desc');

            if ($sessionId) {
                $query->where('session_id', $sessionId);
            }

            $messages = $query->limit(50)->get();

            return [
                'success' => true,
                'messages' => $messages->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'content' => $message->content,
                        'role' => $message->role,
                        'session_id' => $message->session_id,
                        'created_at' => $message->created_at,
                        'metadata' => $message->metadata
                    ];
                })->toArray()
            ];
        } catch (\Exception $e) {
            Log::error('Error getting conversation history', [
                'user_id' => $userId,
                'session_id' => $sessionId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Error retrieving conversation history',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Busca ou cria uma sessão de chat
     */
    private function getOrCreateSession(int $userId, ?string $sessionId = null): ChatSession
    {
        if ($sessionId) {
            $session = ChatSession::where('id', $sessionId)
                ->where('user_id', $userId)
                ->first();

            if ($session) {
                return $session;
            }
        }

        return ChatSession::create([
            'user_id' => $userId,
            'status' => 'active',
            'message_count' => 0,
            'last_message_at' => now()
        ]);
    }

    /**
     * Salva uma mensagem no banco
     */
    private function saveMessage(string $sessionId, string $content, string $role, int $userId): ChatMessage
    {
        return ChatMessage::create([
            'session_id' => $sessionId,
            'user_id' => $userId,
            'content' => $content,
            'role' => $role,
            'metadata' => [
                'timestamp' => now()->toISOString(),
                'processed' => true
            ]
        ]);
    }

    /**
     * Seleciona o serviço de IA apropriado
     */
    private function selectAIService(ChatSession $session): string
    {
        // Lógica para selecionar o melhor serviço baseado no contexto
        $preference = $session->ai_preference ?? 'openai';

        return match ($preference) {
            'claude' => 'claude',
            'gemini' => 'gemini',
            default => 'openai'
        };
    }

    /**
     * Processa mensagem com o serviço de IA selecionado
     */
    private function processWithAI(string $message, ChatSession $session, string $aiService): array
    {
        $startTime = microtime(true);

        // Obter contexto da conversa
        $context = $this->getConversationContext($session->id);

        // Construir prompt com contexto
        $prompt = $this->buildPrompt($message, $context);

        $response = match ($aiService) {
            'claude' => $this->claudeService->generateText($prompt),
            'gemini' => $this->geminiService->generateText($prompt),
            default => $this->openAIService->generateText($prompt)
        };

        $processingTime = microtime(true) - $startTime;

        return [
            'content' => $response['content'],
            'tokens_used' => $response['tokens_used'] ?? 0,
            'processing_time' => $processingTime,
            'ai_service' => $aiService
        ];
    }

    /**
     * Obtém contexto da conversa
     */
    private function getConversationContext(string $sessionId): array
    {
        return ChatMessage::where('session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($message) {
                return [
                    'role' => $message->role,
                    'content' => $message->content
                ];
            })
            ->reverse()
            ->toArray();
    }

    /**
     * Constrói prompt com contexto
     */
    private function buildPrompt(string $message, array $context): string
    {
        $systemPrompt = "You are a helpful AI assistant. Provide clear, accurate, and helpful responses.";

        $prompt = $systemPrompt . "\n\n";

        foreach ($context as $msg) {
            $prompt .= $msg['role'] . ": " . $msg['content'] . "\n";
        }

        $prompt .= "user: " . $message . "\nassistant:";

        return $prompt;
    }
}
