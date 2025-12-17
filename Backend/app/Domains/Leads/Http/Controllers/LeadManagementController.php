<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Contracts\LeadServiceInterface;
use App\Domains\Leads\Http\Requests\StoreLeadRequest;
use App\Domains\Leads\Http\Requests\UpdateLeadRequest;
use App\Domains\Leads\Models\Lead;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel;

/**
 * 📋 Lead Management Controller
 *
 * Controller especializado para operações de gerenciamento de leads
 * Responsável por CRUD e operações de configuração
 * 
 * SECURITY FIX (AUTH-005): Implementada autorização e multi-tenancy
 */
class LeadManagementController extends Controller
{
    protected LeadServiceInterface $leadService;

    public function __construct(LeadServiceInterface $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Renderizar página de leads
     * 
     * SECURITY: Filtrado por project_id
     * AUTH-021: Adicionada autorização
     */
    public function renderLeadsPage(): Response
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', Lead::class);
        
        $projectId = $this->getProjectId();
        
        // SECURITY: Buscar leads do banco com paginação (filtrado por projeto)
        $leadsQuery = LeadModel::with(['assignedTo', 'project'])
            ->orderBy('created_at', 'desc');
        
        if ($projectId) {
            $leadsQuery->where('project_id', $projectId);
        }
        
        $leads = $leadsQuery->paginate(15);

        // SECURITY: Estatísticas dos leads (filtradas por projeto)
        $baseQuery = LeadModel::query();
        if ($projectId) {
            $baseQuery->where('project_id', $projectId);
        }
        
        $totalLeads = (clone $baseQuery)->count();
        $newLeads = (clone $baseQuery)->where('status', 'new')->count();
        $qualifiedLeads = (clone $baseQuery)->where('status', 'qualified')->count();
        $convertedLeads = (clone $baseQuery)->where('status', 'converted')->count();
        $lostLeads = (clone $baseQuery)->where('status', 'lost')->count();

        // SECURITY: Leads por fonte (filtrados por projeto)
        $sourceQuery = LeadModel::selectRaw('source, count(*) as count')
            ->whereNotNull('source');
        if ($projectId) {
            $sourceQuery->where('project_id', $projectId);
        }
        $leadsBySource = $sourceQuery->groupBy('source')->pluck('count', 'source');

        // SECURITY: Leads por status (filtrados por projeto)
        $statusQuery = LeadModel::selectRaw('status, count(*) as count');
        if ($projectId) {
            $statusQuery->where('project_id', $projectId);
        }
        $leadsByStatus = $statusQuery->groupBy('status')->pluck('count', 'status');

        // SECURITY: Top leads por score (filtrados por projeto)
        $topQuery = LeadModel::orderBy('score', 'desc')->limit(10);
        if ($projectId) {
            $topQuery->where('project_id', $projectId);
        }
        $topLeadsByScore = $topQuery->get(['id', 'first_name', 'last_name', 'email', 'score', 'status']);

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
            'stats' => [
                'total' => $totalLeads,
                'new' => $newLeads,
                'qualified' => $qualifiedLeads,
                'converted' => $convertedLeads,
                'lost' => $lostLeads
            ],
            'leadsBySource' => $leadsBySource,
            'leadsByStatus' => $leadsByStatus,
            'topLeadsByScore' => $topLeadsByScore
        ]);
    }

    /**
     * Listar leads
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'source', 'assigned_to', 'project_id']);
            $search = $request->get('search');
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $perPage = $request->get('per_page', 15);

            $leads = $this->leadService->getLeads(
                auth()->id(),
                $filters,
                $search,
                $sortBy,
                $sortOrder,
                $perPage
            );

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Criar lead
     */
    public function store(StoreLeadRequest $request): JsonResponse
    {
        try {
            $lead = $this->leadService->createLead(
                $request->validated(),
                auth()->id()
            );

            return response()->json([
                'success' => true,
                'message' => 'Lead created successfully',
                'data' => $lead
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter lead específico
     */
    public function show(Request $request, int $leadId): JsonResponse
    {
        try {
            $lead = $this->leadService->getLead($leadId, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar lead
     */
    public function update(UpdateLeadRequest $request, int $leadId): JsonResponse
    {
        try {
            $lead = $this->leadService->updateLead(
                $leadId,
                $request->validated(),
                auth()->id()
            );

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar lead
     */
    public function destroy(Request $request, int $leadId): JsonResponse
    {
        try {
            $result = $this->leadService->deleteLead($leadId, auth()->id());

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar leads
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('query');
            $filters = $request->only(['status', 'source', 'assigned_to']);
            $limit = $request->get('limit', 20);

            $leads = $this->leadService->searchLeads(
                $query,
                $filters,
                auth()->id(),
                $limit
            );

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to search leads',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads por status
     */
    public function getByStatus(Request $request, string $status): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsByStatus($status, auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads by status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads por fonte
     */
    public function getBySource(Request $request, string $source): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsBySource($source, auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads by source',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads por segmento
     */
    public function getBySegment(Request $request, int $segmentId): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsBySegment($segmentId, auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads by segment',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de leads
     */
    public function getStats(Request $request): JsonResponse
    {
        try {
            $stats = $this->leadService->getLeadStats(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch lead stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter contadores de leads
     */
    public function getCounts(Request $request): JsonResponse
    {
        try {
            $counts = $this->leadService->getLeadCounts(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $counts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch lead counts',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar se lead existe
     */
    public function exists(Request $request, int $leadId): JsonResponse
    {
        try {
            $exists = $this->leadService->leadExists($leadId, auth()->id());

            return response()->json([
                'success' => true,
                'exists' => $exists
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to check lead existence',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads recentes
     */
    public function getRecent(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 10);
            $leads = $this->leadService->getRecentLeads(auth()->id(), $limit);

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch recent leads',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads por score
     */
    public function getByScore(Request $request): JsonResponse
    {
        try {
            $minScore = $request->get('min_score', 0);
            $maxScore = $request->get('max_score', 100);
            $limit = $request->get('limit', 20);

            $leads = $this->leadService->getLeadsByScore($minScore, $maxScore, auth()->id(), $limit);

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads by score',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
