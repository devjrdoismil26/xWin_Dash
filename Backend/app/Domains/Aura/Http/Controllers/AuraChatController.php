<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Services\WhatsAppService;
use App\Domains\Aura\Services\AuraAIService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * AuraChatController
 * 
 * SECURITY FIX: Adicionado suporte a multi-tenancy via project_id
 */
class AuraChatController extends Controller
{
    public function __construct(
        private readonly WhatsAppService $whatsAppService,
        private readonly AuraAIService $auraAIService
    ) {
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Lista todos os chats ativos
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            // SECURITY: Buscar chats do usuário filtrado por projeto
            $projectId = $this->getProjectId();
            $query = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel::query()
                ->with(['connection'])
                ->orderBy('updated_at', 'desc');
            
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            
            $chats = $query->paginate($request->get('per_page', 15));

            // Enriquecer dados com estatísticas
            $chatsData = $chats->through(function ($chat) {
                return [
                    'id' => $chat->id,
                    'phone_number' => $chat->phone_number,
                    'contact_name' => $chat->contact_name,
                    'status' => $chat->status,
                    'last_message' => $chat->last_message,
                    'last_message_at' => $chat->last_message_at,
                    'created_at' => $chat->created_at,
                    'updated_at' => $chat->updated_at,
                    'connection' => [
                        'id' => $chat->connection->id ?? null,
                        'name' => $chat->connection->name ?? null,
                        'status' => $chat->connection->status ?? null
                    ],
                    'unread_count' => $this->getUnreadCount($chat->id),
                    'assigned_agent' => $chat->assigned_agent ?? null
                ];
            });

            return response()->json([
                'data' => $chatsData,
                'pagination' => [
                    'current_page' => $chats->currentPage(),
                    'per_page' => $chats->perPage(),
                    'total' => $chats->total(),
                    'last_page' => $chats->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar chats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostra detalhes de um chat específico
     */
    public function show($id): JsonResponse
    {
        try {
            $chat = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel::with(['connection'])
                ->find($id);

            if (!$chat) {
                return response()->json(['error' => 'Chat não encontrado'], 404);
            }

            // Verificar se o usuário tem acesso ao chat
            if ($chat->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            // Buscar histórico de mensagens
            $messages = $this->getChatMessages($id);

            // Analisar sentimento da conversa
            $sentiment = $this->auraAIService->analyzeChatSentiment($id);

            return response()->json([
                'data' => [
                    'chat' => $chat,
                    'messages' => $messages,
                    'sentiment_analysis' => $sentiment,
                    'connection_info' => [
                        'id' => $chat->connection->id ?? null,
                        'name' => $chat->connection->name ?? null,
                        'status' => $chat->connection->status ?? null,
                        'webhook_url' => $this->whatsAppService->getWebhookUrl($chat->connection->id ?? '')
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar chat',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo chat
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'phone_number' => 'required|string',
                'connection_id' => 'required|string|exists:aura_connections,id',
                'contact_name' => 'nullable|string|max:255',
                'initial_message' => 'nullable|string'
            ]);

            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            // SECURITY: Criar chat com project_id
            $chat = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel::create([
                'user_id' => $userId,
                'project_id' => $this->getProjectId(),
                'phone_number' => $validated['phone_number'],
                'connection_id' => $validated['connection_id'],
                'contact_name' => $validated['contact_name'],
                'status' => 'active',
                'created_at' => now()
            ]);

            // Enviar mensagem inicial se fornecida
            if (!empty($validated['initial_message'])) {
                $this->whatsAppService->sendTextMessage(
                    $validated['connection_id'],
                    $validated['phone_number'],
                    $validated['initial_message']
                );
            }

            return response()->json([
                'data' => $chat,
                'message' => 'Chat criado com sucesso'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar chat',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um chat existente
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'contact_name' => 'sometimes|string|max:255',
                'status' => 'sometimes|string|in:active,paused,closed',
                'assigned_agent' => 'sometimes|nullable|string',
                'tags' => 'sometimes|array'
            ]);

            $chat = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel::find($id);

            if (!$chat) {
                return response()->json(['error' => 'Chat não encontrado'], 404);
            }

            // Verificar se o usuário tem acesso ao chat
            if ($chat->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            $chat->update($validated);

            return response()->json([
                'data' => $chat->fresh(),
                'message' => 'Chat atualizado com sucesso'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar chat',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Envia uma mensagem no chat
     */
    public function sendMessage(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string',
                'type' => 'sometimes|string|in:text,media,interactive',
                'media_url' => 'required_if:type,media|url',
                'buttons' => 'required_if:type,interactive|array'
            ]);

            $chat = \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel::find($id);

            if (!$chat) {
                return response()->json(['error' => 'Chat não encontrado'], 404);
            }

            // Verificar acesso
            if ($chat->user_id !== auth()->id()) {
                return response()->json(['error' => 'Acesso negado'], 403);
            }

            // Determinar tipo de mensagem e enviar
            $result = match ($validated['type'] ?? 'text') {
                'media' => $this->whatsAppService->sendMediaMessage(
                    $chat->connection_id,
                    $chat->phone_number,
                    $validated['media_url'],
                    $validated['message']
                ),
                'interactive' => $this->whatsAppService->sendInteractiveMessage(
                    $chat->connection_id,
                    $chat->phone_number,
                    $validated['message'],
                    $validated['buttons'] ?? []
                ),
                default => $this->whatsAppService->sendTextMessage(
                    $chat->connection_id,
                    $chat->phone_number,
                    $validated['message']
                )
            };

            if ($result['success']) {
                // Atualizar última mensagem do chat
                $chat->update([
                    'last_message' => $validated['message'],
                    'last_message_at' => now(),
                    'updated_at' => now()
                ]);

                return response()->json([
                    'data' => $result,
                    'message' => 'Mensagem enviada com sucesso'
                ]);
            } else {
                return response()->json([
                    'error' => 'Erro ao enviar mensagem',
                    'message' => $result['error']
                ], 400);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao enviar mensagem',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Analisa intenção de mensagens com IA
     */
    public function analyzeIntent(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string',
                'context' => 'nullable|string'
            ]);

            $analysis = $this->auraAIService->analyzeMessageIntent(
                $validated['message'],
                $validated['context'] ?? ''
            );

            return response()->json([
                'data' => $analysis
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao analisar intenção',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gera resposta automática usando IA
     */
    public function generateResponse(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string',
                'intent' => 'required|string',
                'chat_history' => 'nullable|array'
            ]);

            $response = $this->auraAIService->generateAutomaticResponse(
                $validated['message'],
                $validated['intent'],
                $validated['chat_history'] ?? []
            );

            return response()->json([
                'data' => $response
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao gerar resposta',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chat messages
     *
     * @param int $chatId
     * @param Request $request
     * @return JsonResponse
     */
    public function getMessages(int $chatId, Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $messages = $this->auraChatService->getChatMessages($chatId, $userId, $request->all());
            return response()->json(['data' => $messages]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar mensagens',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark chat as read
     *
     * @param int $chatId
     * @return JsonResponse
     */
    public function markAsRead(int $chatId): JsonResponse
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $result = $this->auraChatService->markChatAsRead($chatId, $userId);
            if (!$result) {
                return response()->json(['message' => 'Chat not found.'], 404);
            }
            return response()->json(['data' => $result, 'message' => 'Chat marked as read.']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao marcar chat como lido',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close chat
     *
     * @param int $chatId
     * @return JsonResponse
     */
    public function close(int $chatId): JsonResponse
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $result = $this->auraChatService->closeChat($chatId, $userId);
            if (!$result) {
                return response()->json(['message' => 'Chat not found.'], 404);
            }
            return response()->json(['data' => $result, 'message' => 'Chat closed successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao fechar chat',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém contagem de mensagens não lidas
     */
    private function getUnreadCount(string $chatId): int
    {
        try {
            return \App\Domains\Aura\Models\AuraMessage::where('chat_id', $chatId)
                ->where('direction', 'inbound')
                ->where('is_read', false)
                ->count();
        } catch (\Exception $e) {
            \Log::error('Erro ao obter contagem de não lidas', [
                'chatId' => $chatId,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    /**
     * Obtém mensagens do chat com paginação
     */
    private function getChatMessages(string $chatId): array
    {
        try {
            $messages = \App\Domains\Aura\Models\AuraMessage::where('chat_id', $chatId)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'content' => $message->content,
                        'message_type' => $message->message_type,
                        'direction' => $message->direction,
                        'status' => $message->status,
                        'is_read' => $message->is_read,
                        'metadata' => $message->metadata,
                        'created_at' => $message->created_at,
                        'updated_at' => $message->updated_at
                    ];
                })
                ->toArray();

            return array_reverse($messages); // Ordenar do mais antigo para o mais recente
        } catch (\Exception $e) {
            \Log::error('Erro ao obter mensagens do chat', [
                'chatId' => $chatId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
}
