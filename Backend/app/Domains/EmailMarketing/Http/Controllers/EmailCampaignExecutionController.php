<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\UpdateCampaignStatusRequest;
use App\Domains\EmailMarketing\Application\Services\EmailCampaignService;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller especializado para execução de campanhas de email
 */
class EmailCampaignExecutionController extends Controller
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
    }

    /**
     * Send a campaign.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function send(Request $request, int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('update', $campaign);
        
        try {
            $options = [
                'send_immediately' => $request->get('send_immediately', false),
                'scheduled_at' => $request->get('scheduled_at'),
                'test_mode' => $request->get('test_mode', false),
                'user_id' => auth()->id()
            ];

            $result = $this->emailCampaignService->sendCampaign($id, $options);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha enviada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::send', [
                'error' => $exception->getMessage(),
                'campaignId' => $id,
                'options' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao enviar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Pause a campaign.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function pause(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('update', $campaign);
        
        try {
            $result = $this->emailCampaignService->updateCampaign($id, [
                'status' => 'paused',
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha pausada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::pause', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao pausar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Resume a campaign.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function resume(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('update', $campaign);
        
        try {
            $result = $this->emailCampaignService->updateCampaign($id, [
                'status' => 'scheduled',
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha retomada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::resume', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao retomar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel a campaign.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function cancel(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('update', $campaign);
        
        try {
            $result = $this->emailCampaignService->updateCampaign($id, [
                'status' => 'cancelled',
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha cancelada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::cancel', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao cancelar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Update campaign status.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function updateStatus(UpdateCampaignStatusRequest $request, int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('update', $campaign);
        
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();

            $result = $this->emailCampaignService->updateCampaign($id, $data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Status da campanha atualizado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::updateStatus', [
                'error' => $exception->getMessage(),
                'campaignId' => $id,
                'data' => $request->validated()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar status da campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Schedule a campaign.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function schedule(Request $request, int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('update', $campaign);
        
        try {
            $request->validate([
                'scheduled_at' => 'required|date|after:now'
            ]);

            $result = $this->emailCampaignService->updateCampaign($id, [
                'status' => 'scheduled',
                'scheduled_at' => $request->get('scheduled_at'),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Campanha agendada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::schedule', [
                'error' => $exception->getMessage(),
                'campaignId' => $id,
                'scheduled_at' => $request->get('scheduled_at')
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao agendar campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Test a campaign.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function test(Request $request, int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('view', $campaign);
        
        try {
            $request->validate([
                'test_emails' => 'required|array',
                'test_emails.*' => 'email'
            ]);

            $options = [
                'test_mode' => true,
                'test_emails' => $request->get('test_emails'),
                'user_id' => auth()->id()
            ];

            $result = $this->emailCampaignService->sendCampaign($id, $options);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Teste de campanha enviado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::test', [
                'error' => $exception->getMessage(),
                'campaignId' => $id,
                'test_emails' => $request->get('test_emails')
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao enviar teste da campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Get campaign execution status.
     * AUTH-PENDENTE-010: Adicionada autorização
     */
    public function executionStatus(int $id): JsonResponse
    {
        // SECURITY: Buscar campanha e verificar autorização e project_id
        $campaign = EmailCampaignModel::findOrFail($id);
        // Verificar se a campanha pertence ao projeto do usuário
        $projectId = session('selected_project_id');
        if ($projectId && $campaign->project_id !== $projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found or access denied.',
            ], 404);
        }
        $this->authorize('view', $campaign);
        
        try {
            $result = $this->emailCampaignService->getCampaign($id);

            $executionStatus = [
                'campaign_id' => $id,
                'status' => $result['status'] ?? 'unknown',
                'scheduled_at' => $result['scheduled_at'] ?? null,
                'sent_at' => $result['sent_at'] ?? null,
                'can_be_sent' => $this->canBeSent($result),
                'can_be_paused' => $this->canBePaused($result),
                'can_be_cancelled' => $this->canBeCancelled($result),
                'is_scheduled' => $this->isScheduled($result),
                'is_sending' => $this->isSending($result),
                'is_sent' => $this->isSent($result),
            ];

            return response()->json([
                'success' => true,
                'data' => $executionStatus
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignExecutionController::executionStatus', [
                'error' => $exception->getMessage(),
                'campaignId' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar status de execução da campanha',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Check if campaign can be sent.
     */
    private function canBeSent(array $campaign): bool
    {
        $status = $campaign['status'] ?? 'unknown';
        return in_array($status, ['draft', 'scheduled', 'paused']);
    }

    /**
     * Check if campaign can be paused.
     */
    private function canBePaused(array $campaign): bool
    {
        $status = $campaign['status'] ?? 'unknown';
        return in_array($status, ['sending', 'scheduled']);
    }

    /**
     * Check if campaign can be cancelled.
     */
    private function canBeCancelled(array $campaign): bool
    {
        $status = $campaign['status'] ?? 'unknown';
        return in_array($status, ['draft', 'scheduled', 'paused']);
    }

    /**
     * Check if campaign is scheduled.
     */
    private function isScheduled(array $campaign): bool
    {
        $status = $campaign['status'] ?? 'unknown';
        return $status === 'scheduled' && !empty($campaign['scheduled_at']);
    }

    /**
     * Check if campaign is sending.
     */
    private function isSending(array $campaign): bool
    {
        $status = $campaign['status'] ?? 'unknown';
        return $status === 'sending';
    }

    /**
     * Check if campaign is sent.
     */
    private function isSent(array $campaign): bool
    {
        $status = $campaign['status'] ?? 'unknown';
        return $status === 'sent';
    }
}
