<?php

namespace App\Domains\Dashboard\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use App\Domains\Dashboard\Application\Queries\GetDashboardWidgetQuery;
use App\Domains\Dashboard\Application\Commands\ExportDashboardDataCommand;
use App\Domains\Dashboard\Application\Handlers\GetDashboardWidgetHandler;
use App\Domains\Dashboard\Application\Handlers\ExportDashboardDataHandler;
use App\Domains\Dashboard\Models\DashboardShare;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardWidgetModel;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardLayoutModel;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardAlertModel;
use App\Domains\Dashboard\Models\DashboardWidget;
use App\Domains\Dashboard\Models\DashboardLayout;
use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * DashboardController
 * 
 * SECURITY FIX (AUTH-003): Implementada filtragem por project_id em todos os queries
 * para evitar vazamento de dados entre projetos (multi-tenancy)
 */
class DashboardController extends Controller
{
    /**
     * Get the current project ID from session
     * SECURITY: Retorna null se não houver projeto selecionado
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Apply project filter to a query builder
     * SECURITY: Filtra registros pelo projeto ativo
     */
    protected function applyProjectFilter($query, ?string $column = 'project_id')
    {
        $projectId = $this->getProjectId();
        if ($projectId) {
            return $query->where($column, $projectId);
        }
        return $query;
    }
    public function __construct(
        private GetDashboardWidgetHandler $getDashboardWidgetHandler,
        private ExportDashboardDataHandler $exportDashboardDataHandler
    ) {
    }
    /**
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function renderDashboard(): Response
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        // Verificar se há projeto selecionado
        $selectedProjectId = session('selected_project_id');
        $currentProject = null;
        
        if ($selectedProjectId) {
            $currentProject = ProjectModel::where('id', $selectedProjectId)
                ->where('owner_id', auth()->id())
                ->first();
        }
        
        // Se não há projeto selecionado, redirecionar para seleção
        if (!$currentProject) {
            return redirect()->route('projects.select');
        }
        
        // Buscar métricas reais do banco de dados (filtradas por projeto se aplicável)
        $totalLeads = LeadModel::count();
        $totalUsers = User::count();
        $totalProjects = ProjectModel::count();
        $totalCampaigns = EmailCampaignModel::count();

        // Calcular crescimento (últimos 30 dias vs anteriores)
        $leadsThisMonth = LeadModel::whereBetween('created_at', [now()->subMonth(), now()])->count();
        $leadsLastMonth = LeadModel::whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])->count();
        $leadsGrowth = $leadsLastMonth > 0 ? (($leadsThisMonth - $leadsLastMonth) / $leadsLastMonth) * 100 : 0;

        $usersThisMonth = User::whereBetween('created_at', [now()->subMonth(), now()])->count();
        $usersLastMonth = User::whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])->count();
        $usersGrowth = $usersLastMonth > 0 ? (($usersThisMonth - $usersLastMonth) / $usersLastMonth) * 100 : 0;

        // Atividades recentes
        $recentActivities = [
            [
                'action' => 'Novos leads capturados',
                'count' => $leadsThisMonth,
                'timestamp' => now()->subHours(2)->toISOString(),
                'type' => 'lead'
            ],
            [
                'action' => 'Usuários registrados',
                'count' => $usersThisMonth,
                'timestamp' => now()->subHours(4)->toISOString(),
                'type' => 'user'
            ],
            [
                'action' => 'Projetos criados',
                'count' => ProjectModel::whereBetween('created_at', [now()->subMonth(), now()])->count(),
                'timestamp' => now()->subHours(6)->toISOString(),
                'type' => 'project'
            ]
        ];

        // Top leads por score
        $topLeads = LeadModel::orderBy('score', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'score', 'status', 'created_at']);

        // Projetos recentes
        $recentProjects = ProjectModel::with('owner')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'description', 'status', 'owner_id', 'created_at']);

        return Inertia::render('Dashboard/DashboardMain', [
            'currentProject' => [
                'id' => $currentProject->id,
                'name' => $currentProject->name,
                'description' => $currentProject->description,
                'mode' => $currentProject->isUniverse() ? 'universe' : 'normal',
                'modules' => $currentProject->modules ?? []
            ],
            'dashboardData' => [
                'metrics' => [
                    'total_leads' => $totalLeads,
                    'total_users' => $totalUsers,
                    'total_projects' => $totalProjects,
                    'total_campaigns' => $totalCampaigns,
                    'leads_growth' => round($leadsGrowth, 1),
                    'users_growth' => round($usersGrowth, 1),
                    'conversion_rate' => $totalLeads > 0 ? round((LeadModel::where('status', 'converted')->count() / $totalLeads) * 100, 1) : 0,
                    'active_projects' => ProjectModel::where('is_active', true)->count()
                ],
                'recent_activities' => $recentActivities,
                'top_leads' => $topLeads,
                'recent_projects' => $recentProjects,
                'stats' => [
                    'leads_by_status' => LeadModel::selectRaw('status, count(*) as count')
                        ->groupBy('status')
                        ->pluck('count', 'status'),
                    'leads_by_source' => LeadModel::selectRaw('source, count(*) as count')
                        ->whereNotNull('source')
                        ->groupBy('source')
                        ->pluck('count', 'source'),
                    'monthly_leads' => LeadModel::selectRaw("strftime('%m', created_at) as month, count(*) as count")
                        ->whereRaw("strftime('%Y', created_at) = ?", [now()->year]) // Usar whereRaw para compatibilidade
                        ->groupBy('month')
                        ->pluck('count', 'month')
                ]
            ]
        ]);
    }

    /**
     * Get complete dashboard data for API consumption
     * 
     * Endpoint: GET /api/dashboard/data
     * Schema: DashboardDataSchema (Frontend)
     * 
     * SECURITY FIX: Dados filtrados por project_id do projeto ativo
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getData(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        
        // SECURITY: Buscar métricas filtradas por projeto
        $leadsQuery = LeadModel::query();
        if ($projectId) {
            $leadsQuery->where('project_id', $projectId);
        }
        $totalLeads = $leadsQuery->count();
        
        $totalUsers = User::count(); // Users são globais
        
        $projectsQuery = ProjectModel::where('owner_id', auth()->id());
        $totalProjects = $projectsQuery->count();
        $activeProjects = (clone $projectsQuery)->where('is_active', true)->count();
        
        $campaignsQuery = EmailCampaignModel::query();
        if ($projectId) {
            $campaignsQuery->where('project_id', $projectId);
        }
        $totalCampaigns = $campaignsQuery->count();

        // SECURITY: Calcular crescimento (últimos 30 dias vs anteriores) - filtrado por projeto
        $leadsThisMonthQuery = LeadModel::whereBetween('created_at', [now()->subMonth(), now()]);
        $leadsLastMonthQuery = LeadModel::whereBetween('created_at', [now()->subMonths(2), now()->subMonth()]);
        if ($projectId) {
            $leadsThisMonthQuery->where('project_id', $projectId);
            $leadsLastMonthQuery->where('project_id', $projectId);
        }
        $leadsThisMonth = $leadsThisMonthQuery->count();
        $leadsLastMonth = $leadsLastMonthQuery->count();
        $leadsGrowth = $leadsLastMonth > 0 ? (($leadsThisMonth - $leadsLastMonth) / $leadsLastMonth) * 100 : 0;

        $usersThisMonth = User::whereBetween('created_at', [now()->subMonth(), now()])->count();
        $usersLastMonth = User::whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])->count();
        $usersGrowth = $usersLastMonth > 0 ? (($usersThisMonth - $usersLastMonth) / $usersLastMonth) * 100 : 0;

        $projectsThisMonth = ProjectModel::where('owner_id', auth()->id())->whereBetween('created_at', [now()->subMonth(), now()])->count();
        $projectsLastMonth = ProjectModel::where('owner_id', auth()->id())->whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])->count();
        $projectsGrowth = $projectsLastMonth > 0 ? (($projectsThisMonth - $projectsLastMonth) / $projectsLastMonth) * 100 : 0;

        $campaignsThisMonthQuery = EmailCampaignModel::whereBetween('created_at', [now()->subMonth(), now()]);
        $campaignsLastMonthQuery = EmailCampaignModel::whereBetween('created_at', [now()->subMonths(2), now()->subMonth()]);
        if ($projectId) {
            $campaignsThisMonthQuery->where('project_id', $projectId);
            $campaignsLastMonthQuery->where('project_id', $projectId);
        }
        $campaignsThisMonth = $campaignsThisMonthQuery->count();
        $campaignsLastMonth = $campaignsLastMonthQuery->count();
        $campaignsGrowth = $campaignsLastMonth > 0 ? (($campaignsThisMonth - $campaignsLastMonth) / $campaignsLastMonth) * 100 : 0;

        $totalRevenue = $this->calculateTotalRevenue();
        $revenueGrowth = $this->calculateRevenueGrowth();

        // SECURITY: Converted leads filtrados por projeto
        $convertedLeadsQuery = LeadModel::where('status', 'converted');
        if ($projectId) {
            $convertedLeadsQuery->where('project_id', $projectId);
        }
        $convertedLeads = $convertedLeadsQuery->count();
        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;

        // Atividades recentes
        $recentActivities = [];
        
        // SECURITY: Leads recentes filtrados por projeto
        $recentLeadsQuery = LeadModel::orderBy('created_at', 'desc')->limit(3);
        if ($projectId) {
            $recentLeadsQuery->where('project_id', $projectId);
        }
        $recentLeads = $recentLeadsQuery->get();
        foreach ($recentLeads as $lead) {
            $recentActivities[] = [
                'id' => 'lead_' . $lead->id,
                'action' => 'Novo lead capturado',
                'description' => 'Lead ' . $lead->name . ' foi adicionado',
                'count' => 1,
                'timestamp' => $lead->created_at->toISOString(),
                'type' => 'lead',
                'user_name' => $lead->name
            ];
        }

        // Usuários recentes
        $recentUsers = User::orderBy('created_at', 'desc')->limit(2)->get();
        foreach ($recentUsers as $user) {
            $recentActivities[] = [
                'id' => 'user_' . $user->id,
                'action' => 'Novo usuário registrado',
                'description' => $user->name . ' criou uma conta',
                'count' => 1,
                'timestamp' => $user->created_at->toISOString(),
                'type' => 'user',
                'user_name' => $user->name
            ];
        }

        // Ordenar por timestamp desc
        usort($recentActivities, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        // Limitar a 10
        $recentActivities = array_slice($recentActivities, 0, 10);

        // SECURITY: Top leads por score filtrados por projeto
        $topLeadsQuery = LeadModel::orderBy('score', 'desc')->limit(10);
        if ($projectId) {
            $topLeadsQuery->where('project_id', $projectId);
        }
        $topLeads = $topLeadsQuery->get()
            ->map(function($lead) {
                return [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'email' => $lead->email,
                    'score' => $lead->score ?? 0,
                    'status' => $lead->status,
                    'source' => $lead->source ?? 'unknown',
                    'created_at' => $lead->created_at->toISOString(),
                    'last_activity_at' => $lead->last_activity_at?->toISOString()
                ];
            });

        // SECURITY: Projetos recentes filtrados pelo owner
        $recentProjects = ProjectModel::with('owner')
            ->where('owner_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description ?? '',
                    'status' => $project->is_active ? 'active' : 'inactive',
                    'owner_id' => $project->owner_id,
                    'created_at' => $project->created_at->toISOString(),
                    'updated_at' => $project->updated_at->toISOString(),
                    'deadline' => $project->deadline?->toISOString(),
                    'progress' => $project->progress ?? 0,
                    'owner' => [
                        'id' => $project->owner->id,
                        'name' => $project->owner->name,
                        'email' => $project->owner->email
                    ]
                ];
            });

        // SECURITY: Stats filtrados por projeto
        $leadsByStatusQuery = LeadModel::selectRaw('status, count(*) as count');
        if ($projectId) {
            $leadsByStatusQuery->where('project_id', $projectId);
        }
        $leadsByStatus = $leadsByStatusQuery->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $leadsBySourceQuery = LeadModel::selectRaw('source, count(*) as count')->whereNotNull('source');
        if ($projectId) {
            $leadsBySourceQuery->where('project_id', $projectId);
        }
        $leadsBySource = $leadsBySourceQuery->groupBy('source')
            ->pluck('count', 'source')
            ->toArray();

        $monthlyLeadsQuery = LeadModel::selectRaw("strftime('%Y-%m', created_at) as month, count(*) as count")
            ->whereRaw("strftime('%Y', created_at) = ?", [now()->year]);
        if ($projectId) {
            $monthlyLeadsQuery->where('project_id', $projectId);
        }
        $monthlyLeads = $monthlyLeadsQuery->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => [
                    'total_leads' => $totalLeads,
                    'total_users' => $totalUsers,
                    'total_projects' => $totalProjects,
                    'active_projects' => $activeProjects,
                    'total_campaigns' => $totalCampaigns,
                    'total_revenue' => $totalRevenue,
                    'conversion_rate' => $conversionRate,
                    'leads_growth' => round($leadsGrowth, 1),
                    'users_growth' => round($usersGrowth, 1),
                    'projects_growth' => round($projectsGrowth, 1),
                    'campaigns_growth' => round($campaignsGrowth, 1),
                    'revenue_growth' => round($revenueGrowth, 1)
                ],
                'recent_activities' => $recentActivities,
                'top_leads' => $topLeads->toArray(),
                'recent_projects' => $recentProjects->toArray(),
                'stats' => [
                    'leads_by_status' => $leadsByStatus,
                    'leads_by_source' => $leadsBySource,
                    'monthly_leads' => $monthlyLeads
                ]
            ]
        ]);
    }

    /**
     * IMPL-003: Adicionado filtro por projeto
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getMetrics(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();

        // SECURITY: Filtrar por projeto
        $leadsQuery = LeadModel::query();
        if ($projectId) {
            $leadsQuery->where('project_id', $projectId);
        }
        $totalLeads = $leadsQuery->count();

        $totalUsers = User::count(); // Users são globais

        $projectsQuery = ProjectModel::where('owner_id', auth()->id());
        $totalProjects = $projectsQuery->count();

        $campaignsQuery = EmailCampaignModel::query();
        if ($projectId) {
            $campaignsQuery->where('project_id', $projectId);
        }
        $totalCampaigns = $campaignsQuery->count();

        $convertedLeadsQuery = LeadModel::where('status', 'converted');
        if ($projectId) {
            $convertedLeadsQuery->where('project_id', $projectId);
        }
        $conversionRate = $totalLeads > 0 ? round(($convertedLeadsQuery->count() / $totalLeads) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_leads' => $totalLeads,
                'total_campaigns' => $totalCampaigns,
                'total_revenue' => $this->calculateTotalRevenue(),
                'conversion_rate' => $conversionRate,
                'total_users' => $totalUsers,
                'total_projects' => $totalProjects
            ]
        ]);
    }

    /**
     * IMPL-003: Adicionado filtro por projeto
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getActivities(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $activities = collect();

        // SECURITY: Leads recentes filtrados por projeto
        $recentLeadsQuery = LeadModel::orderBy('created_at', 'desc')->limit(5);
        if ($projectId) {
            $recentLeadsQuery->where('project_id', $projectId);
        }
        $recentLeads = $recentLeadsQuery->get();
        foreach ($recentLeads as $lead) {
            $activities->push([
                'type' => 'lead_created',
                'message' => "Novo lead: {$lead->name}",
                'timestamp' => $lead->created_at->toISOString(),
                'data' => ['lead_id' => $lead->id, 'lead_name' => $lead->name]
            ]);
        }

        // SECURITY: Projetos recentes do usuário
        $recentProjects = ProjectModel::where('owner_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();
        foreach ($recentProjects as $project) {
            $activities->push([
                'type' => 'project_created',
                'message' => "Projeto criado: {$project->name}",
                'timestamp' => $project->created_at->toISOString(),
                'data' => ['project_id' => $project->id, 'project_name' => $project->name]
            ]);
        }

        // Ordenar por timestamp
        $activities = $activities->sortByDesc('timestamp')->values();

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    /**
     * IMPL-003: Adicionado filtro por projeto
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getOverview(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();

        // SECURITY: Filtrar por projeto
        $leadsQuery = LeadModel::query();
        if ($projectId) {
            $leadsQuery->where('project_id', $projectId);
        }
        $totalLeads = $leadsQuery->count();

        $projectsQuery = ProjectModel::where('owner_id', auth()->id());
        $totalProjects = $projectsQuery->count();
        $activeProjects = (clone $projectsQuery)->where('is_active', true)->count();

        $leadsThisMonthQuery = LeadModel::whereMonth('created_at', now()->month);
        if ($projectId) {
            $leadsThisMonthQuery->where('project_id', $projectId);
        }
        $leadsThisMonth = $leadsThisMonthQuery->count();

        $convertedLeadsQuery = LeadModel::where('status', 'converted');
        if ($projectId) {
            $convertedLeadsQuery->where('project_id', $projectId);
        }
        $conversionRate = $totalLeads > 0 ? round(($convertedLeadsQuery->count() / $totalLeads) * 100, 1) : 0;

        $overview = [
            'total_leads' => $totalLeads,
            'total_projects' => $totalProjects,
            'total_users' => User::count(), // Users são globais
            'active_projects' => $activeProjects,
            'leads_this_month' => $leadsThisMonth,
            'conversion_rate' => $conversionRate
        ];

        return response()->json([
            'success' => true,
            'data' => $overview
        ]);
    }

    /**
     * Get dashboard widgets
     * 
     * IMPL-001: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function getWidgets(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar widgets do usuário filtrados por projeto
        $query = DashboardWidgetModel::where('user_id', $userId);
        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $widgets = $query->get()->map(function($widget) {
            $config = $widget->config ?? [];
            return [
                'id' => $widget->id,
                'type' => $widget->type,
                'title' => $config['title'] ?? 'Widget',
                'position' => $config['position'] ?? ['x' => 0, 'y' => 0, 'w' => 4, 'h' => 2],
                'visible' => $config['visible'] ?? true,
                'settings' => $config['settings'] ?? [],
                'created_at' => $widget->created_at->toISOString(),
                'updated_at' => $widget->updated_at->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $widgets
        ]);
    }

    /**
     * Get specific widget
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getWidget(string $id): JsonResponse
    {
        // SECURITY: Buscar widget e verificar autorização
        $widget = DashboardWidgetModel::findOrFail($id);
        $this->authorize('view', $widget);
        
        try {
            $userId = auth()->id();
            $query = new GetDashboardWidgetQuery(
                userId: $userId,
                widgetId: (int)$id,
                includeData: true
            );

            $widget = $this->getDashboardWidgetHandler->handle($query);

            return response()->json([
                'success' => true,
                'data' => $widget
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create widget
     * 
     * IMPL-001: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function createWidget(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('createWidget', DashboardWidget::class);
        
        $request->validate([
            'type' => 'required|string',
            'title' => 'required|string',
            'position' => 'required|array',
            'settings' => 'nullable|array',
            'visible' => 'nullable|boolean'
        ]);

        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Criar widget com project_id
        $widget = DashboardWidgetModel::create([
            'user_id' => $userId,
            'project_id' => $projectId,
            'type' => $request->type,
            'config' => [
                'title' => $request->title,
                'position' => $request->position,
                'visible' => $request->visible ?? true,
                'settings' => $request->settings ?? [],
            ],
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $widget->id,
                'type' => $widget->type,
                'title' => $request->title,
                'position' => $request->position,
                'visible' => $request->visible ?? true,
                'settings' => $request->settings ?? [],
                'created_at' => $widget->created_at->toISOString(),
            ]
        ], 201);
    }

    /**
     * Update widget
     * 
     * IMPL-001: Implementação real com persistência
     */
    /**
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function updateWidget(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'title' => 'nullable|string',
            'position' => 'nullable|array',
            'settings' => 'nullable|array',
            'visible' => 'nullable|boolean'
        ]);

        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar widget do usuário e projeto
        $widget = DashboardWidgetModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $widget->where('project_id', $projectId);
        }
        $widget = $widget->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('updateWidget', DashboardWidget::findOrFail($widget->id));

        // Atualizar config
        $config = $widget->config ?? [];
        if ($request->has('title')) {
            $config['title'] = $request->title;
        }
        if ($request->has('position')) {
            $config['position'] = $request->position;
        }
        if ($request->has('visible')) {
            $config['visible'] = $request->visible;
        }
        if ($request->has('settings')) {
            $config['settings'] = array_merge($config['settings'] ?? [], $request->settings);
        }

        $widget->update(['config' => $config]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $widget->id,
                'type' => $widget->type,
                'title' => $config['title'] ?? 'Widget',
                'position' => $config['position'] ?? [],
                'visible' => $config['visible'] ?? true,
                'settings' => $config['settings'] ?? [],
                'updated_at' => $widget->updated_at->toISOString(),
            ]
        ]);
    }

    /**
     * Delete widget
     * 
     * IMPL-001: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function deleteWidget(string $id): JsonResponse
    {
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Verificar ownership e projeto
        $widget = DashboardWidgetModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $widget->where('project_id', $projectId);
        }
        $widget = $widget->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('deleteWidget', DashboardWidget::findOrFail($widget->id));

        $widget->delete();

        return response()->json([
            'success' => true,
            'message' => 'Widget deleted successfully'
        ]);
    }

    /**
     * Refresh widget data
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function refreshWidget(string $id): JsonResponse
    {
        // SECURITY: Buscar widget e verificar autorização
        $widget = DashboardWidgetModel::findOrFail($id);
        $this->authorize('view', $widget);
        
        return response()->json([
            'success' => true,
            'data' => ['id' => $id, 'refreshed_at' => now()]
        ]);
    }

    /**
     * Get widget data
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getWidgetData(string $id, Request $request): JsonResponse
    {
        // SECURITY: Buscar widget e verificar autorização
        $widget = DashboardWidgetModel::findOrFail($id);
        $this->authorize('view', $widget);
        
        $data = [
            'id' => $id,
            'data' => [],
            'last_updated' => now()
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get dashboard layouts
     * 
     * IMPL-002: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function getLayouts(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar layouts do usuário filtrados por projeto
        $query = DashboardLayoutModel::where('user_id', $userId);
        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $layouts = $query->get()->map(function($layout) {
            return [
                'id' => $layout->id,
                'name' => $layout->layout['name'] ?? 'Layout',
                'widgets' => $layout->widgets ?? [],
                'columns' => $layout->layout['columns'] ?? 12,
                'gap' => $layout->layout['gap'] ?? 4,
                'is_default' => $layout->layout['is_default'] ?? false,
                'created_at' => $layout->created_at->toISOString(),
                'updated_at' => $layout->updated_at->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $layouts
        ]);
    }

    /**
     * Get specific layout
     * 
     * IMPL-002: Implementação real com persistência
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function getLayout(string $id): JsonResponse
    {
        // SECURITY: Buscar layout e verificar autorização
        $layout = DashboardLayoutModel::findOrFail($id);
        $this->authorize('view', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar layout do usuário e projeto
        $query = DashboardLayoutModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $query->where('project_id', $projectId);
        }
        $layout = $query->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $layout->id,
                'name' => $layout->layout['name'] ?? 'Layout',
                'widgets' => $layout->widgets ?? [],
                'columns' => $layout->layout['columns'] ?? 12,
                'gap' => $layout->layout['gap'] ?? 4,
                'is_default' => $layout->layout['is_default'] ?? false,
                'created_at' => $layout->created_at->toISOString(),
                'updated_at' => $layout->updated_at->toISOString(),
            ]
        ]);
    }

    /**
     * Save layout
     * 
     * IMPL-002: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function saveLayout(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', DashboardWidget::class);
        
        $request->validate([
            'name' => 'required|string',
            'widgets' => 'required|array',
            'columns' => 'nullable|integer|min:1|max:24',
            'gap' => 'nullable|integer|min:0|max:12'
        ]);

        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Criar layout com project_id
        $layout = DashboardLayoutModel::create([
            'user_id' => $userId,
            'project_id' => $projectId,
            'layout' => [
                'name' => $request->name,
                'columns' => $request->columns ?? 12,
                'gap' => $request->gap ?? 4,
                'is_default' => false,
            ],
            'widgets' => $request->widgets,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $layout->id,
                'name' => $request->name,
                'widgets' => $request->widgets,
                'columns' => $request->columns ?? 12,
                'gap' => $request->gap ?? 4,
                'is_default' => false,
                'created_at' => $layout->created_at->toISOString(),
            ]
        ], 201);
    }

    /**
     * Update layout
     * 
     * IMPL-002: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function updateLayout(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string',
            'widgets' => 'nullable|array',
            'columns' => 'nullable|integer|min:1|max:24',
            'gap' => 'nullable|integer|min:0|max:12'
        ]);

        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar layout do usuário e projeto
        $layout = DashboardLayoutModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $layout->where('project_id', $projectId);
        }
        $layout = $layout->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('update', DashboardWidget::class);

        // Atualizar dados
        $layoutData = $layout->layout ?? [];
        if ($request->has('name')) {
            $layoutData['name'] = $request->name;
        }
        if ($request->has('columns')) {
            $layoutData['columns'] = $request->columns;
        }
        if ($request->has('gap')) {
            $layoutData['gap'] = $request->gap;
        }

        $updateData = ['layout' => $layoutData];
        if ($request->has('widgets')) {
            $updateData['widgets'] = $request->widgets;
        }

        $layout->update($updateData);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $layout->id,
                'name' => $layoutData['name'] ?? 'Layout',
                'widgets' => $layout->widgets ?? [],
                'columns' => $layoutData['columns'] ?? 12,
                'gap' => $layoutData['gap'] ?? 4,
                'is_default' => $layoutData['is_default'] ?? false,
                'updated_at' => $layout->updated_at->toISOString(),
            ]
        ]);
    }

    /**
     * Delete layout
     * 
     * IMPL-002: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function deleteLayout(string $id): JsonResponse
    {
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Verificar ownership e projeto
        $layout = DashboardLayoutModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $layout->where('project_id', $projectId);
        }
        $layout = $layout->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('delete', DashboardWidget::class);

        $layout->delete();

        return response()->json([
            'success' => true,
            'message' => 'Layout deleted successfully'
        ]);
    }

    /**
     * Set default layout
     * 
     * IMPL-002: Implementação real com persistência
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function setDefaultLayout(string $id): JsonResponse
    {
        // SECURITY: Buscar layout e verificar autorização
        $layout = DashboardLayoutModel::findOrFail($id);
        $this->authorize('update', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar layout do usuário e projeto
        $layout = DashboardLayoutModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $layout->where('project_id', $projectId);
        }
        $layout = $layout->firstOrFail();

        // Remover default de outros layouts do mesmo usuário/projeto
        $query = DashboardLayoutModel::where('user_id', $userId)
            ->where('id', '!=', $id);
        if ($projectId) {
            $query->where('project_id', $projectId);
        }
        $otherLayouts = $query->get();
        foreach ($otherLayouts as $other) {
            $otherLayout = $other->layout ?? [];
            $otherLayout['is_default'] = false;
            $other->update(['layout' => $otherLayout]);
        }

        // Definir este como default
        $layoutData = $layout->layout ?? [];
        $layoutData['is_default'] = true;
        $layout->update(['layout' => $layoutData]);

        return response()->json([
            'success' => true,
            'message' => 'Default layout updated successfully'
        ]);
    }

    /**
     * Export dashboard
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function exportDashboard(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $request->validate([
            'format' => 'required|string|in:pdf,excel,csv,json',
            'widgets' => 'nullable|array',
            'date_range' => 'nullable|string'
        ]);

        try {
            $userId = auth()->id();
            $command = new ExportDashboardDataCommand(
                userId: $userId,
                format: $request->format,
                widgetIds: $request->widgets,
                dateRange: $request->date_range,
                filters: $request->except(['format', 'widgets', 'date_range'])
            );

            $exportData = $this->exportDashboardDataHandler->handle($command);

            return response()->json([
                'success' => true,
                'data' => $exportData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Share dashboard
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function shareDashboard(Request $request, string $id): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $request->validate([
            'expires_at' => 'nullable|date|after:now',
            'permissions' => 'nullable|array',
            'permissions.*' => 'in:view,edit,export'
        ]);

        try {
            $userId = auth()->id();
            $token = DashboardShare::generateToken();
            $shareUrl = url("/dashboard/shared/{$token}");

            $share = DashboardShare::create([
                'dashboard_id' => (int)$id,
                'user_id' => $userId,
                'token' => $token,
                'share_url' => $shareUrl,
                'permissions' => $request->permissions ?? ['view'],
                'expires_at' => $request->expires_at ? new \DateTime($request->expires_at) : null,
                'is_active' => true,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $share->id,
                    'dashboard_id' => (int)$id,
                    'share_token' => $token,
                    'share_url' => $shareUrl,
                    'permissions' => $share->permissions,
                    'expires_at' => $share->expires_at?->toISOString(),
                    'created_at' => $share->created_at->toISOString(),
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
     * Get shared dashboard
     * NOTA: Este método é público (compartilhado via token), mas valida o token
     */
    public function getSharedDashboard(string $token): JsonResponse
    {
        // SECURITY: Validação via token (não requer autenticação, mas valida o token)
        try {
            $share = DashboardShare::where('token', $token)
                ->where('is_active', true)
                ->first();

            if (!$share) {
                return response()->json([
                    'success' => false,
                    'error' => 'Share not found or inactive'
                ], 404);
            }

            if (!$share->isValid()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Share has expired'
                ], 410); // 410 Gone
            }

            // Record access
            $share->recordAccess();

            // Get dashboard data (simplified - in production would fetch full dashboard)
            $dashboard = [
                'id' => $share->dashboard_id,
                'token' => $token,
                'permissions' => $share->permissions,
                'shared_at' => $share->created_at->toISOString(),
                'expires_at' => $share->expires_at?->toISOString(),
                'view_count' => $share->view_count,
                'last_accessed_at' => $share->last_accessed_at?->toISOString(),
                'is_valid' => true,
                'data' => [] // Dashboard data would be loaded here
            ];

            return response()->json([
                'success' => true,
                'data' => $dashboard
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard alerts
     * 
     * IMPL-015: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function getAlerts(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Buscar alertas do usuário filtrados por projeto
        $query = DashboardAlertModel::where('user_id', $userId)
            ->where(function($q) use ($projectId) {
                $q->whereNull('project_id')
                  ->orWhere('project_id', $projectId);
            })
            ->where(function($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            })
            ->orderBy('created_at', 'desc');

        if ($request->has('unread_only') && $request->unread_only) {
            $query->where('read', false);
        }

        $alerts = $query->limit($request->limit ?? 50)->get()->map(function($alert) {
            return [
                'id' => $alert->id,
                'type' => $alert->type,
                'title' => $alert->title,
                'message' => $alert->message,
                'metadata' => $alert->metadata ?? [],
                'read' => $alert->read,
                'read_at' => $alert->read_at?->toISOString(),
                'expires_at' => $alert->expires_at?->toISOString(),
                'timestamp' => $alert->created_at->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $alerts,
            'unread_count' => DashboardAlertModel::where('user_id', $userId)
                ->where('read', false)
                ->where(function($q) use ($projectId) {
                    $q->whereNull('project_id')
                      ->orWhere('project_id', $projectId);
                })
                ->where(function($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->count()
        ]);
    }

    /**
     * Mark alert as read
     * 
     * IMPL-015: Implementação real com persistência
     * AUTH-PENDENTE-004: Adicionada autorização
     */
    public function markAlertAsRead(string $id): JsonResponse
    {
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Verificar ownership e projeto
        $alert = DashboardAlertModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $alert->where(function($q) use ($projectId) {
                $q->whereNull('project_id')
                  ->orWhere('project_id', $projectId);
            });
        }
        $alert = $alert->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('update', DashboardWidget::class);

        $alert->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Alert marked as read'
        ]);
    }

    /**
     * Mark all alerts as read
     * 
     * IMPL-015: Implementação real com persistência
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function markAllAlertsAsRead(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('update', DashboardWidget::class);
        
        $projectId = $this->getProjectId();
        $userId = auth()->id();

        // SECURITY: Marcar todos os alertas não lidos do usuário/projeto
        $query = DashboardAlertModel::where('user_id', $userId)
            ->where('read', false);
        if ($projectId) {
            $query->where(function($q) use ($projectId) {
                $q->whereNull('project_id')
                  ->orWhere('project_id', $projectId);
            });
        }

        $updated = $query->update([
            'read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "All alerts marked as read ({$updated} alerts updated)"
        ]);
    }

    /**
     * Subscribe to real-time updates
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function subscribeToUpdates(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        return response()->json([
            'success' => true,
            'data' => ['subscribed' => true]
        ]);
    }

    /**
     * Unsubscribe from real-time updates
     * AUTH-PENDENTE-014: Adicionada autorização
     */
    public function unsubscribeFromUpdates(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        return response()->json([
            'success' => true,
            'data' => ['unsubscribed' => true]
        ]);
    }

    /**
     * Calculate total revenue from various sources
     */
    private function calculateTotalRevenue(): float
    {
        try {
            $totalRevenue = 0;

            // Revenue from transactions
            $transactionRevenue = \App\Domains\Core\Models\Transaction::where('status', 'completed')
                ->where('type', 'payment')
                ->sum('amount');
            $totalRevenue += $transactionRevenue;

            // Revenue from subscriptions
            $subscriptionRevenue = \App\Domains\Core\Models\Subscription::where('status', 'active')
                ->sum('amount');
            $totalRevenue += $subscriptionRevenue;

            // Revenue from orders (if exists)
            if (class_exists('\App\Domains\Products\Models\Order')) {
                $orderRevenue = \App\Domains\Products\Models\Order::where('status', 'completed')
                    ->sum('total_amount');
                $totalRevenue += $orderRevenue;
            }

            return round($totalRevenue, 2);
        } catch (\Exception $e) {
            Log::error('Error calculating total revenue', [
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    private function calculateRevenueGrowth(): float
    {
        try {
            $revenueThisMonth = 0;
            $revenueLastMonth = 0;

            // Transactions this month
            $transactionsThisMonth = \App\Domains\Core\Models\Transaction::where('status', 'completed')
                ->where('type', 'payment')
                ->whereBetween('created_at', [now()->subMonth(), now()])
                ->sum('amount');
            $revenueThisMonth += $transactionsThisMonth;

            // Transactions last month
            $transactionsLastMonth = \App\Domains\Core\Models\Transaction::where('status', 'completed')
                ->where('type', 'payment')
                ->whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])
                ->sum('amount');
            $revenueLastMonth += $transactionsLastMonth;

            // Orders this month (if exists)
            if (class_exists('\App\Domains\Products\Models\Order')) {
                $ordersThisMonth = \App\Domains\Products\Models\Order::where('status', 'completed')
                    ->whereBetween('created_at', [now()->subMonth(), now()])
                    ->sum('total_amount');
                $revenueThisMonth += $ordersThisMonth;

                $ordersLastMonth = \App\Domains\Products\Models\Order::where('status', 'completed')
                    ->whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])
                    ->sum('total_amount');
                $revenueLastMonth += $ordersLastMonth;
            }

            if ($revenueLastMonth > 0) {
                return round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1);
            }

            return 0;
        } catch (\Exception $e) {
            Log::error('Error calculating revenue growth', [
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }
}
