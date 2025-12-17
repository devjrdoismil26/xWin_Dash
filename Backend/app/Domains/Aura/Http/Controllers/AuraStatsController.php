<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;

class AuraStatsController extends Controller
{
    /**
     * Get Aura statistics
     * Endpoint: GET /api/aura/stats
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $projectId = $request->input('project_id') ?? session('selected_project_id');
            $period = $request->input('period', '30'); // days

            // Buscar connections do usuário (filtro de segurança)
            $connectionIds = AuraConnectionModel::where('user_id', $userId)
                ->when($projectId, fn($q) => $q->where('project_id', $projectId))
                ->pluck('id')
                ->toArray();

            if (empty($connectionIds)) {
                return response()->json([
                    'success' => true,
                    'data' => $this->getEmptyStats(),
                ]);
            }

            $startDate = now()->subDays((int) $period);

            // Calcular estatísticas
            $stats = [
                'messages' => [
                    'sent' => AuraMessageModel::whereIn('chat_id', function($query) use ($connectionIds) {
                            $query->select('id')
                                ->from('aura_chats')
                                ->whereIn('connection_id', $connectionIds);
                        })
                        ->where('direction', 'outbound')
                        ->where('created_at', '>=', $startDate)
                        ->count(),
                    'received' => AuraMessageModel::whereIn('chat_id', function($query) use ($connectionIds) {
                            $query->select('id')
                                ->from('aura_chats')
                                ->whereIn('connection_id', $connectionIds);
                        })
                        ->where('direction', 'inbound')
                        ->where('created_at', '>=', $startDate)
                        ->count(),
                ],
                'chats' => [
                    'total' => AuraChatModel::whereIn('connection_id', $connectionIds)->count(),
                    'active' => AuraChatModel::whereIn('connection_id', $connectionIds)
                        ->where('status', 'open')
                        ->count(),
                    'closed' => AuraChatModel::whereIn('connection_id', $connectionIds)
                        ->where('status', 'closed')
                        ->count(),
                ],
                'flows' => [
                    'total' => AuraFlowModel::whereIn('connection_id', $connectionIds)->count(),
                    'active' => AuraFlowModel::whereIn('connection_id', $connectionIds)
                        ->where('status', 'active')
                        ->where('is_active', true)
                        ->count(),
                ],
                'connections' => [
                    'total' => count($connectionIds),
                    'active' => AuraConnectionModel::whereIn('id', $connectionIds)
                        ->where('is_active', true)
                        ->count(),
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar estatísticas do Aura',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get empty stats structure
     */
    private function getEmptyStats(): array
    {
        return [
            'messages' => [
                'sent' => 0,
                'received' => 0,
            ],
            'chats' => [
                'total' => 0,
                'active' => 0,
                'closed' => 0,
            ],
            'flows' => [
                'total' => 0,
                'active' => 0,
            ],
            'connections' => [
                'total' => 0,
                'active' => 0,
            ],
        ];
    }
}
