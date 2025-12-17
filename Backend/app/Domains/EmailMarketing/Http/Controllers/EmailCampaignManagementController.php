<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\StoreEmailCampaignRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateEmailCampaignRequest;
use App\Domains\EmailMarketing\Application\Services\EmailCampaignService;
use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller especializado para gerenciamento de campanhas de email
 * 
 * SECURITY FIX (AUTH-008): Implementada filtragem por project_id para multi-tenancy
 */
class EmailCampaignManagementController extends Controller
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Display a listing of the email campaigns.
     * SECURITY: Filtrado por project_id
     * AUTH-019: Adicionada autorização
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', EmailCampaign::class);
        
        try {
            $filters = [
                'per_page' => $request->get('per_page', 15),
                'page' => $request->get('page', 1),
                'status' => $request->get('status'),
                'search' => $request->get('search'),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_direction' => $request->get('sort_direction', 'desc'),
                'user_id' => auth()->id(),
                'project_id' => $this->getProjectId() // SECURITY: Multi-tenancy
            ];

            $result = $this->emailCampaignService->listCampaigns($filters);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::index', [
                'error' => $exception->getMessage(),
                'filters' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar campanhas',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created email campaign in storage.
     * SECURITY: project_id adicionado automaticamente
     * AUTH-019: Adicionada autorização
     */
    public function store(StoreEmailCampaignRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', EmailCampaign::class);
        
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();
            $data['project_id'] = $this->getProjectId(); // SECURITY: Multi-tenancy

            $result = $this->emailCampaignService->createCampaign($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha criada com sucesso'
            ], 201);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::store', [
                'error' => $exception->getMessage(),
                'data' => $request->validated()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified email campaign.
     * AUTH-PENDENTE-013: Adicionada autorização
     */
    public function show(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização
        $campaign = EmailCampaignModel::findOrFail($id);
        $this->authorize('view', $campaign);
        
        try {
            $result = $this->emailCampaignService->getCampaign($id);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::show', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified email campaign in storage.
     * AUTH-PENDENTE-013: Adicionada autorização
     */
    public function update(UpdateEmailCampaignRequest $request, int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização
        $campaign = EmailCampaignModel::findOrFail($id);
        $this->authorize('update', $campaign);
        
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();

            $result = $this->emailCampaignService->updateCampaign($id, $data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha atualizada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::update', [
                'error' => $exception->getMessage(),
                'campaignId' => $id,
                'data' => $request->validated()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified email campaign from storage.
     * AUTH-PENDENTE-013: Adicionada autorização
     */
    public function destroy(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização
        $campaign = EmailCampaignModel::findOrFail($id);
        $this->authorize('delete', $campaign);
        
        try {
            $result = $this->emailCampaignService->deleteCampaign($id);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha removida com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::destroy', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao remover campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Get campaign statistics.
     * AUTH-PENDENTE-013: Adicionada autorização
     */
    public function stats(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização
        $campaign = EmailCampaignModel::findOrFail($id);
        $this->authorize('view', $campaign);
        
        try {
            $result = $this->emailCampaignService->getCampaignStats($id);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::stats', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar estatísticas da campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Get campaigns by status.
     * SECURITY: Filtrado por project_id
     * AUTH-PENDENTE-016: Adicionada autorização
     */
    public function getByStatus(string $status): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', EmailCampaign::class);
        
        try {
            $filters = [
                'status' => $status,
                'user_id' => auth()->id(),
                'project_id' => $this->getProjectId(), // SECURITY: Multi-tenancy
                'per_page' => 50
            ];

            $result = $this->emailCampaignService->listCampaigns($filters);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::getByStatus', [
                'error' => $exception->getMessage(),
                'status' => $status
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar campanhas por status',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Get campaigns by type.
     * SECURITY: Filtrado por project_id
     * AUTH-PENDENTE-016: Adicionada autorização
     */
    public function getByType(string $type): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', EmailCampaign::class);
        
        try {
            $filters = [
                'type' => $type,
                'user_id' => auth()->id(),
                'project_id' => $this->getProjectId(), // SECURITY: Multi-tenancy
                'per_page' => 50
            ];

            $result = $this->emailCampaignService->listCampaigns($filters);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::getByType', [
                'error' => $exception->getMessage(),
                'type' => $type
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar campanhas por tipo',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Search campaigns.
     * SECURITY: Filtrado por project_id
     * AUTH-PENDENTE-016: Adicionada autorização
     */
    public function search(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', EmailCampaign::class);
        
        try {
            $filters = [
                'search' => $request->get('q'),
                'user_id' => auth()->id(),
                'project_id' => $this->getProjectId(), // SECURITY: Multi-tenancy
                'per_page' => $request->get('per_page', 15),
                'page' => $request->get('page', 1)
            ];

            $result = $this->emailCampaignService->listCampaigns($filters);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignManagementController::search', [
                'error' => $exception->getMessage(),
                'query' => $request->get('q')
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar campanhas',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
