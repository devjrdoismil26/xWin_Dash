<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;

class DashboardController extends Controller
{
    /**
     * Get Aura Dashboard data
     * Endpoint: GET /api/aura/dashboard
     */
    public function dashboard(): JsonResponse
    {
        try {
            $userId = auth()->id();
            $projectId = session('selected_project_id');

            // Buscar connections do usuário (filtro de segurança)
            $connectionIds = AuraConnectionModel::where('user_id', $userId)
                ->when($projectId, fn($q) => $q->where('project_id', $projectId))
                ->pluck('id')
                ->toArray();

            if (empty($connectionIds)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'metrics' => $this->getEmptyMetrics(),
                        'stats' => $this->getEmptyStats(),
                        'recent_chats' => [],
                        'active_flows' => [],
                        'connections' => [],
                    ]
                ]);
            }

            // Métricas de conversação (dados reais)
            $metrics = $this->calculateMetrics($connectionIds);

            // Stats (dados reais)
            $stats = $this->calculateStats($connectionIds);

            // Recent chats (dados reais)
            $recentChats = $this->getRecentChats($connectionIds, 10);

            // Active flows (dados reais)
            $activeFlows = $this->getActiveFlows($connectionIds, 5);

            // Connections (dados reais)
            $connections = $this->getConnections($userId, $projectId);

            return response()->json([
                'success' => true,
                'data' => [
                    'metrics' => $metrics,
                    'stats' => $stats,
                    'recent_chats' => $recentChats,
                    'active_flows' => $activeFlows,
                    'connections' => $connections,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calcular métricas de conversação
     */
    private function calculateMetrics(array $connectionIds): array
    {
        // Total de conversas (chats únicos)
        $totalConversations = AuraChatModel::whereIn('connection_id', $connectionIds)
            ->count();

        // Conversas ativas (últimas 24h)
        $activeConversations = AuraChatModel::whereIn('connection_id', $connectionIds)
            ->where('status', 'active')
            ->where('is_active', true)
            ->where('updated_at', '>=', now()->subDay())
            ->count();

        // Taxa de resposta (últimos 30 dias)
        $startDate = now()->subDays(30);
        
        // Mensagens recebidas (inbound)
        $inboundMessages = AuraMessageModel::whereIn('chat_id', function($query) use ($connectionIds) {
                $query->select('id')
                    ->from('aura_chats')
                    ->whereIn('connection_id', $connectionIds);
            })
            ->where('direction', 'inbound')
            ->where('created_at', '>=', $startDate)
            ->count();

        // Mensagens enviadas (outbound) que foram respostas (dentro de 5 minutos após inbound)
        $messagesWithResponse = AuraMessageModel::whereIn('chat_id', function($query) use ($connectionIds) {
                $query->select('id')
                    ->from('aura_chats')
                    ->whereIn('connection_id', $connectionIds);
            })
            ->where('direction', 'outbound')
            ->where('created_at', '>=', $startDate)
            ->whereExists(function($query) {
                $query->select(DB::raw(1))
                    ->from('aura_messages as m2')
                    ->whereColumn('m2.chat_id', 'aura_messages.chat_id')
                    ->where('m2.direction', 'inbound')
                    ->whereColumn('m2.created_at', '<', 'aura_messages.created_at')
                    ->whereRaw('TIMESTAMPDIFF(MINUTE, m2.created_at, aura_messages.created_at) <= 5');
            })
            ->count();

        $responseRate = $inboundMessages > 0
            ? round(($messagesWithResponse / $inboundMessages) * 100, 2)
            : 0;

        // Tempo médio de resposta (em segundos)
        // Usar query SQL otimizada para calcular tempo médio de resposta
        $avgResponseTime = DB::table('aura_messages as outbound')
            ->join('aura_chats', 'outbound.chat_id', '=', 'aura_chats.id')
            ->whereIn('aura_chats.connection_id', $connectionIds)
            ->where('outbound.direction', 'outbound')
            ->where('outbound.created_at', '>=', $startDate)
            ->whereExists(function($query) {
                $query->select(DB::raw(1))
                    ->from('aura_messages as inbound')
                    ->whereColumn('inbound.chat_id', 'outbound.chat_id')
                    ->where('inbound.direction', 'inbound')
                    ->whereColumn('inbound.created_at', '<', 'outbound.created_at')
                    ->orderBy('inbound.created_at', 'desc')
                    ->limit(1);
            })
            ->selectRaw('AVG(
                TIMESTAMPDIFF(SECOND,
                    (SELECT created_at FROM aura_messages m2 
                     WHERE m2.chat_id = outbound.chat_id 
                     AND m2.direction = "inbound" 
                     AND m2.created_at < outbound.created_at 
                     ORDER BY m2.created_at DESC LIMIT 1),
                    outbound.created_at
                )
            ) as avg_response_time')
            ->value('avg_response_time') ?? 0;

        // Limitar a valores razoáveis (0 a 3600 segundos = 1 hora)
        $avgResponseTime = $avgResponseTime > 0 && $avgResponseTime < 3600 
            ? (int)round($avgResponseTime) 
            : 0;

        // Score de satisfação (se houver campo no metadata ou stats)
        $satisfactionScore = AuraChatModel::whereIn('connection_id', $connectionIds)
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('metadata')
            ->get()
            ->filter(function($chat) {
                return isset($chat->metadata['satisfaction_score']);
            })
            ->avg(function($chat) {
                return $chat->metadata['satisfaction_score'] ?? 0;
            }) ?? 0;

        return [
            'total_conversations' => $totalConversations,
            'active_conversations' => $activeConversations,
            'response_rate' => $responseRate,
            'avg_response_time' => (int)round($avgResponseTime),
            'satisfaction_score' => round($satisfactionScore, 2),
        ];
    }

    /**
     * Calcular estatísticas
     */
    private function calculateStats(array $connectionIds): array
    {
        $startDate = now()->subDays(30);

        $messagesSent = AuraMessageModel::whereIn('chat_id', function($query) use ($connectionIds) {
                $query->select('id')
                    ->from('aura_chats')
                    ->whereIn('connection_id', $connectionIds);
            })
            ->where('direction', 'outbound')
            ->where('created_at', '>=', $startDate)
            ->count();

        $messagesReceived = AuraMessageModel::whereIn('chat_id', function($query) use ($connectionIds) {
                $query->select('id')
                    ->from('aura_chats')
                    ->whereIn('connection_id', $connectionIds);
            })
            ->where('direction', 'inbound')
            ->where('created_at', '>=', $startDate)
            ->count();

        $activeFlows = AuraFlowModel::whereIn('connection_id', $connectionIds)
            ->where('status', 'active')
            ->where('is_active', true)
            ->count();

        $totalContacts = AuraChatModel::whereIn('connection_id', $connectionIds)
            ->distinct('phone_number')
            ->count('phone_number');

        return [
            'messages_sent' => $messagesSent,
            'messages_received' => $messagesReceived,
            'active_flows' => $activeFlows,
            'total_contacts' => $totalContacts,
        ];
    }

    /**
     * Buscar chats recentes
     */
    private function getRecentChats(array $connectionIds, int $limit = 10): array
    {
        $chats = AuraChatModel::whereIn('connection_id', $connectionIds)
            ->with(['messages' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(1);
            }])
            ->withCount(['messages as unread_count' => function($query) {
                $query->where('direction', 'inbound')
                    ->where('status', 'unread');
            }])
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();

        return $chats->map(function($chat) {
            $lastMessage = $chat->messages->first();
            
            return [
                'id' => $chat->id,
                'contact_name' => $chat->contact_name ?? 'Unknown',
                'last_message' => $lastMessage?->content['text'] ?? $lastMessage?->content['body'] ?? $lastMessage?->content['message'] ?? '',
                'timestamp' => $chat->updated_at->toISOString(),
                'unread_count' => $chat->unread_count ?? 0,
                'status' => $chat->status ?? 'pending',
            ];
        })
        ->toArray();
    }

    /**
     * Buscar flows ativos
     */
    private function getActiveFlows(array $connectionIds, int $limit = 5): array
    {
        return AuraFlowModel::whereIn('connection_id', $connectionIds)
            ->where('status', 'active')
            ->where('is_active', true)
            ->withCount(['nodes'])
            ->limit($limit)
            ->get()
            ->map(function($flow) {
                // Calcular completion_rate baseado em chats que completaram o flow
                // Por enquanto, retornar 0 se não houver dados suficientes
                $totalSubscribers = AuraChatModel::where('connection_id', $flow->connection_id)
                    ->whereHas('messages', function($q) use ($flow) {
                        $q->where('metadata->flow_id', $flow->id);
                    })
                    ->count();

                $completedSubscribers = AuraChatModel::where('connection_id', $flow->connection_id)
                    ->whereHas('messages', function($q) use ($flow) {
                        $q->where('metadata->flow_id', $flow->id)
                          ->where('metadata->flow_status', 'completed');
                    })
                    ->count();

                $completionRate = $totalSubscribers > 0
                    ? round(($completedSubscribers / $totalSubscribers) * 100, 2)
                    : 0;

                return [
                    'id' => $flow->id,
                    'name' => $flow->name,
                    'status' => $flow->status,
                    'subscribers' => $totalSubscribers,
                    'completion_rate' => $completionRate,
                ];
            })
            ->toArray();
    }

    /**
     * Buscar connections
     * Otimização: Cache de 2 minutos
     */
    private function getConnections(?string $userId, ?string $projectId): array
    {
        $cacheKey = "aura_dashboard_connections_{$userId}_{$projectId}";
        
        return Cache::remember($cacheKey, 120, function () use ($userId, $projectId) {
            // Otimização: Selecionar apenas campos necessários
            return AuraConnectionModel::where('user_id', $userId)
                ->when($projectId, fn($q) => $q->where('project_id', $projectId))
                ->select('id', 'type', 'status', 'config', 'updated_at')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function($connection) {
                    $config = $connection->config ?? [];
                    
                    return [
                        'id' => $connection->id,
                        'platform' => $connection->type ?? 'whatsapp',
                        'phone_number' => $config['phone_number'] ?? $config['phone'] ?? '',
                        'status' => $connection->status ?? 'disconnected',
                        'last_sync' => $connection->updated_at->toISOString(),
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Retornar métricas vazias
     */
    private function getEmptyMetrics(): array
    {
        return [
            'total_conversations' => 0,
            'active_conversations' => 0,
            'response_rate' => 0,
            'avg_response_time' => 0,
            'satisfaction_score' => 0,
        ];
    }

    /**
     * Retornar stats vazios
     */
    private function getEmptyStats(): array
    {
        return [
            'messages_sent' => 0,
            'messages_received' => 0,
            'active_flows' => 0,
            'total_contacts' => 0,
        ];
    }
}
