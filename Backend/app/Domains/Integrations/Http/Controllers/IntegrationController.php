<?php

namespace App\Domains\Integrations\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\Integrations\Models\Integration;
use App\Domains\Integrations\Models\IntegrationLog;
use App\Domains\Integrations\Services\IntegrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class IntegrationController extends Controller
{
    public function __construct(
        private readonly IntegrationService $integrationService
    ) {}

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', Integration::class);
        
        $projectId = session('selected_project_id');
        
        $query = Integration::query();
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        // Cache de 1 minuto para status de sincronização
        $cacheKey = "integrations_list_{$projectId}_" . Auth::id() . "_" . md5($request->get('provider') . $request->get('status'));
        
        $integrations = Cache::remember($cacheKey, 60, function () use ($query, $request) {
            $query->with(['credentials', 'logs' => fn($q) => $q->latest()->limit(5)]);

            if ($request->has('provider')) {
                $query->byProvider($request->provider);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            return $query->get();
        });

        return response()->json([
            'integrations' => $integrations,
            'total' => $integrations->count(),
            'available_providers' => $this->getAvailableProviders()
        ]);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', Integration::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|in:google,facebook,whatsapp,mailchimp,stripe,webhook',
            'config' => 'required|array',
            'credentials_id' => 'nullable|exists:api_credentials,id',
            'sync_frequency' => 'nullable|integer|min:5'
        ]);

        // SECURITY: Usar project_id da sessão em vez de current_project_id
        $projectId = session('selected_project_id');
        
        $integration = Integration::create([
            ...$validated,
            'user_id' => Auth::id(),
            'project_id' => $projectId,
            'status' => 'disconnected',
            'is_active' => false
        ]);

        return response()->json($integration, 201);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function show(int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->with(['credentials', 'logs', 'mappings'])
            ->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('view', $integration);

        return response()->json($integration);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('update', $integration);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'config' => 'sometimes|array',
            'credentials_id' => 'nullable|exists:api_credentials,id',
            'sync_frequency' => 'nullable|integer|min:5',
            'is_active' => 'sometimes|boolean'
        ]);

        $integration->update($validated);

        return response()->json($integration);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function destroy(int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('delete', $integration);

        $integration->delete();

        return response()->json(['message' => 'Integration deleted successfully']);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function testConnection(int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('testConnection', $integration);

        $result = $this->integrationService->testConnection($integration);

        IntegrationLog::create([
            'integration_id' => $integration->id,
            'action' => 'test_connection',
            'status' => $result['success'] ? 'success' : 'error',
            'response_data' => $result,
            'duration_ms' => $result['duration_ms'] ?? 0
        ]);

        return response()->json($result);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function sync(int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('sync', $integration);

        if (!$integration->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Integration is not active'
            ], 400);
        }

        $jobId = $this->integrationService->queueSync($integration);

        return response()->json([
            'success' => true,
            'message' => 'Sync queued successfully',
            'job_id' => $jobId
        ]);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function logs(int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('viewLogs', $integration);

        $logs = IntegrationLog::where('integration_id', $integration->id)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    /**
     * AUTH-PENDENTE-002: Adicionada autorização
     */
    public function status(int $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        
        $query = Integration::where('id', $id);
        
        // SECURITY: Filtrar por project_id se disponível, senão por user_id
        if ($projectId) {
            $query->where('project_id', $projectId);
        } else {
            $query->where('user_id', Auth::id());
        }
        
        $integration = $query->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('view', $integration);

        $stats = [
            'status' => $integration->status,
            'is_active' => $integration->is_active,
            'is_healthy' => $integration->isHealthy(),
            'last_sync' => $integration->last_sync_at,
            'error_count' => $integration->error_count,
            'last_error' => $integration->last_error,
            'recent_logs' => IntegrationLog::where('integration_id', $integration->id)
                ->latest()
                ->limit(10)
                ->get(),
            'stats' => [
                'total_syncs' => IntegrationLog::where('integration_id', $integration->id)
                    ->where('action', 'sync')
                    ->count(),
                'successful_syncs' => IntegrationLog::where('integration_id', $integration->id)
                    ->where('action', 'sync')
                    ->where('status', 'success')
                    ->count(),
                'failed_syncs' => IntegrationLog::where('integration_id', $integration->id)
                    ->where('action', 'sync')
                    ->where('status', 'error')
                    ->count(),
                'avg_duration' => IntegrationLog::where('integration_id', $integration->id)
                    ->where('action', 'sync')
                    ->avg('duration_ms')
            ]
        ];

        return response()->json($stats);
    }

    private function getAvailableProviders(): array
    {
        return [
            'google' => [
                'name' => 'Google Workspace',
                'services' => ['sheets', 'calendar', 'gmail', 'drive'],
                'oauth_required' => true
            ],
            'facebook' => [
                'name' => 'Facebook Marketing',
                'services' => ['ads', 'pages', 'instagram'],
                'oauth_required' => true
            ],
            'whatsapp' => [
                'name' => 'WhatsApp Business',
                'services' => ['messaging', 'webhooks'],
                'oauth_required' => false
            ],
            'mailchimp' => [
                'name' => 'Mailchimp',
                'services' => ['campaigns', 'lists', 'automation'],
                'oauth_required' => true
            ],
            'stripe' => [
                'name' => 'Stripe',
                'services' => ['payments', 'subscriptions', 'customers'],
                'oauth_required' => false
            ],
            'webhook' => [
                'name' => 'Custom Webhooks',
                'services' => ['incoming', 'outgoing'],
                'oauth_required' => false
            ]
        ];
    }
}

