<?php

namespace App\Domains\ADStool\Http\Controllers;

use App\Domains\ADStool\Application\Services\ADStoolApplicationService;
use App\Domains\ADStool\Http\Requests\IndexCampaignRequest;
use App\Domains\ADStool\Http\Requests\StoreCampaignRequest;
use App\Domains\ADStool\Http\Requests\UpdateCampaignRequest;
use App\Domains\ADStool\Http\Resources\CampaignResource;
use App\Domains\ADStool\Models\ADSCampaign;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaign as ADSCampaignModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * CampaignController
 * 
 * SECURITY FIX (AUTH-010): Adicionada filtragem por project_id para multi-tenancy
 */
class CampaignController extends Controller
{
    protected ADStoolApplicationService $applicationService;

    public function __construct(ADStoolApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Get complete dashboard data for ADStool
     * 
     * Endpoint: GET /api/adstool/dashboard
     * Schema: ADSToolDashboardDataSchema (Frontend)
     * 
     * SECURITY: Filtrado por project_id
     * AUTH-PENDENTE-003: Adicionada autorização
     */
    public function dashboard(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ADSCampaignModel::class);
        
        try {
            $userId = auth()->id();
            $projectId = $this->getProjectId();
            
            // SECURITY: Get all campaigns for overview (filtrado por projeto)
            $query = ADSCampaign::where('user_id', $userId);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            $campaigns = $query->get()
                ->map(function($campaign) {
                    return [
                        'id' => $campaign->id,
                        'name' => $campaign->name,
                        'status' => $campaign->status,
                        'platform' => $campaign->platform,
                        'budget' => $campaign->daily_budget ?? 0,
                        'spent' => $campaign->total_spend ?? 0,
                        'impressions' => $campaign->impressions ?? 0,
                        'clicks' => $campaign->clicks ?? 0,
                        'conversions' => $campaign->conversions ?? 0,
                        'ctr' => $campaign->ctr ?? 0,
                        'cpc' => $campaign->cpc ?? 0,
                        'created_at' => $campaign->created_at->toISOString(),
                    ];
                });

            // Calculate overview metrics
            $totalCampaigns = $campaigns->count();
            $activeCampaigns = $campaigns->where('status', 'active')->count();
            $totalSpent = $campaigns->sum('spent');
            $totalImpressions = $campaigns->sum('impressions');
            $totalClicks = $campaigns->sum('clicks');
            $totalConversions = $campaigns->sum('conversions');
            $avgCtr = $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0;
            $avgCpc = $totalClicks > 0 ? $totalSpent / $totalClicks : 0;

            $overview = [
                'total_campaigns' => $totalCampaigns,
                'active_campaigns' => $activeCampaigns,
                'total_spent' => round($totalSpent, 2),
                'total_impressions' => $totalImpressions,
                'total_clicks' => $totalClicks,
                'total_conversions' => $totalConversions,
                'average_ctr' => round($avgCtr, 2),
                'average_cpc' => round($avgCpc, 2),
                'by_platform' => [
                    'google_ads' => $campaigns->where('platform', 'google_ads')->count(),
                    'facebook_ads' => $campaigns->where('platform', 'facebook_ads')->count(),
                    'instagram_ads' => $campaigns->where('platform', 'instagram_ads')->count(),
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => $overview,
                    'campaigns' => $campaigns->values()->toArray(),
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
     * AUTH-PENDENTE-003: Adicionada autorização
     */
    public function index(IndexCampaignRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ADSCampaignModel::class);
        
        try {
            $userId = auth()->id();
            $filters = $request->validated();

            // Usar Application Service para listar campanhas
            $result = $this->applicationService->listCampaigns($userId, $filters);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => CampaignResource::collection($result['data']['campaigns']),
                'meta' => [
                    'total' => $result['data']['total'] ?? 0,
                    'filters' => $filters
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $data = array_merge($request->validated(), ['user_id' => $userId]);

            // Usar Application Service para criar campanha
            $result = $this->applicationService->createCampaign($data);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => new CampaignResource($result['data']['campaign']),
                'message' => $result['message']
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('view', $campaign);
            $userId = auth()->id();

            // Usar Application Service para obter campanha
            $result = $this->applicationService->getCampaign($campaign->id, $userId, [
                'include_ad_groups' => true,
                'include_creatives' => true,
                'include_analytics' => true
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new CampaignResource($result['data']['campaign'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateCampaignRequest $request, ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('update', $campaign);
            $data = $request->validated();

            // Usar Application Service para atualizar campanha
            $result = $this->applicationService->updateCampaign($campaign->id, $data);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => new CampaignResource($result['data']['campaign']),
                'message' => $result['message']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('delete', $campaign);
            $userId = auth()->id();

            // Usar Application Service para deletar campanha
            $result = $this->applicationService->deleteCampaign($campaign->id, $userId);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => $result['message']
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Pausar uma campanha
     */
    public function pause(ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('update', $campaign);
            $userId = auth()->id();

            // Usar Application Service para pausar campanha
            $result = $this->applicationService->updateCampaign($campaign->id, [
                'status' => 'paused'
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Campanha pausada com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retomar uma campanha
     */
    public function resume(ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('update', $campaign);
            $userId = auth()->id();

            // Usar Application Service para retomar campanha
            $result = $this->applicationService->updateCampaign($campaign->id, [
                'status' => 'active'
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Campanha retomada com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar orçamento de uma campanha
     */
    public function updateBudget(\Illuminate\Http\Request $request, ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('update', $campaign);

            $request->validate([
                'daily_budget' => 'required|numeric|min:0.01'
            ]);

            // Usar Application Service para atualizar orçamento
            $result = $this->applicationService->updateCampaign($campaign->id, [
                'budget' => $request->daily_budget
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Orçamento atualizado com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter analytics de uma campanha
     */
    public function analytics(ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('view', $campaign);
            $userId = auth()->id();

            // Usar Application Service para obter analytics
            $result = $this->applicationService->getCampaign($campaign->id, $userId, [
                'include_analytics' => true
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $result['data']['analytics'] ?? []
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sincronizar campanha com plataforma externa
     */
    public function sync(ADSCampaign $campaign): JsonResponse
    {
        try {
            $this->authorize('update', $campaign);
            $userId = auth()->id();

            // Usar Application Service para sincronizar campanha
            $result = $this->applicationService->updateCampaign($campaign->id, [
                'sync_status' => 'syncing',
                'last_sync_at' => now()
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Campanha sincronizada com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter resumo de analytics para o usuário
     */
    public function analyticsSummary(): JsonResponse
    {
        try {
            $userId = auth()->id();

            // Usar Application Service para obter resumo de analytics
            $result = $this->applicationService->listCampaigns($userId, [
                'include_analytics' => true,
                'limit' => 1000 // Buscar todas as campanhas para o resumo
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'errors' => $result['errors']
                ], 400);
            }

            // Calcular resumo das campanhas
            $campaigns = $result['data']['campaigns'] ?? [];
            $summary = $this->calculateAnalyticsSummary($campaigns);

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calcula resumo de analytics das campanhas
     */
    private function calculateAnalyticsSummary(array $campaigns): array
    {
        $totalCampaigns = count($campaigns);
        $activeCampaigns = 0;
        $totalSpent = 0;
        $totalImpressions = 0;
        $totalClicks = 0;

        foreach ($campaigns as $campaign) {
            if ($campaign['status'] === 'active') {
                $activeCampaigns++;
            }

            $analytics = $campaign['analytics'] ?? [];
            $totalSpent += $analytics['spent'] ?? 0;
            $totalImpressions += $analytics['impressions'] ?? 0;
            $totalClicks += $analytics['clicks'] ?? 0;
        }

        return [
            'total_campaigns' => $totalCampaigns,
            'active_campaigns' => $activeCampaigns,
            'total_spent' => $totalSpent,
            'total_impressions' => $totalImpressions,
            'total_clicks' => $totalClicks,
            'average_ctr' => $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0
        ];
    }
}
