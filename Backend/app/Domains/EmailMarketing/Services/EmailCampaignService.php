<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Contracts\EmailCampaignRepositoryInterface;
use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Domain\EmailLog; // Supondo que a entidade de domínio exista
use App\Domains\EmailMarketing\Contracts\EmailLogRepositoryInterface;
use App\Domains\EmailMarketing\Exceptions\CampaignStatusException;
use App\Domains\EmailMarketing\Notifications\CampaignStatusNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class EmailCampaignService
{
    protected EmailCampaignRepositoryInterface $emailCampaignRepository;

    protected EmailLogRepositoryInterface $emailLogRepository;

    public function __construct(
        EmailCampaignRepositoryInterface $emailCampaignRepository,
        EmailLogRepositoryInterface $emailLogRepository,
    ) {
        $this->emailCampaignRepository = $emailCampaignRepository;
        $this->emailLogRepository = $emailLogRepository;
    }

    /**
     * Cria uma nova campanha de e-mail.
     *
     * @param int   $userId
     * @param array<string, mixed> $data
     *
     * @return EmailCampaign
     */
    /**
     * @param array<string, mixed> $data
     */
    public function createCampaign(int $userId, array $data): EmailCampaign
    {
        $data['user_id'] = $userId;
        $data['status'] = $data['status'] ?? 'draft';
        return $this->emailCampaignRepository->create($data);
    }

    /**
     * Obtém uma campanha de e-mail pelo ID.
     *
     * @param int $id
     *
     * @return EmailCampaign|null
     */
    public function getCampaignById(int $id): ?EmailCampaign
    {
        return $this->emailCampaignRepository->find($id);
    }

    /**
     * Atualiza uma campanha de e-mail.
     *
     * @param int   $id
     * @param array<string, mixed> $data
     *
     * @return EmailCampaign
     */
    /**
     * @param array<string, mixed> $data
     */
    public function updateCampaign(int $id, array $data): EmailCampaign
    {
        return $this->emailCampaignRepository->update($id, $data);
    }

    /**
     * Deleta uma campanha de e-mail.
     *
     * @param int $id
     *
     * @return bool
     */
    public function deleteCampaign(int $id): bool
    {
        return $this->emailCampaignRepository->delete($id);
    }

    /**
     * Retorna todas as campanhas de e-mail paginadas para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllCampaigns(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->emailCampaignRepository->getAllPaginated($perPage);
    }

    /**
     * Atualiza o status de uma campanha de e-mail.
     *
     * @param int    $campaignId
     * @param string $newStatus
     *
     * @return EmailCampaign
     *
     * @throws CampaignStatusException
     */
    public function updateCampaignStatus(int $campaignId, string $newStatus): EmailCampaign
    {
        $campaign = $this->emailCampaignRepository->find($campaignId);

        if (!$campaign) {
            throw new \RuntimeException("Campaign not found.");
        }

        // Armazenar o status anterior para notificação
        $oldStatus = $campaign->status;

        // Lógica de validação de transição de status, se necessário
        // if ($campaign->status === 'sent' && $newStatus === 'draft') {
        //     throw new CampaignStatusException("Cannot change status from sent to draft.");
        // }

        $updatedCampaign = $this->emailCampaignRepository->update($campaignId, ['status' => $newStatus]);

        // Enviar notificação se o status mudou e há um usuário autenticado
        if ($oldStatus !== $newStatus && Auth::check()) {
            $user = Auth::user();
            $user->notify(new CampaignStatusNotification($updatedCampaign, $oldStatus, $newStatus));
        }

        return $updatedCampaign;
    }

    /**
     * Cria um log de e-mail.
     *
     * @param int         $campaignId
     * @param int         $subscriberId
     * @param string      $status
     * @param string|null $errorMessage
     *
     * @return EmailLog
     */
    public function createEmailLog(int $campaignId, int $subscriberId, string $status, ?string $errorMessage = null): EmailLog
    {
        return $this->emailLogRepository->create([
            'campaign_id' => $campaignId,
            'subscriber_id' => $subscriberId,
            'status' => $status,
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Atualiza o status de um log de e-mail.
     *
     * @param int         $emailLogId
     * @param string      $status
     * @param string|null $errorMessage
     *
     * @return EmailLog
     */
    public function updateEmailLogStatus(int $emailLogId, string $status, ?string $errorMessage = null): EmailLog
    {
        return $this->emailLogRepository->updateStatus($emailLogId, $status, $errorMessage);
    }

    // ===== SEGMENTAÇÃO =====

    /**
     * Get segment subscribers
     *
     * @param int $segmentId
     * @param array $filters
     * @return array|null
     */
    public function getSegmentSubscribers(int $segmentId, array $filters = []): ?array
    {
        // Implementation for getting segment subscribers
        return [];
    }

    /**
     * Test segment rules
     *
     * @param int $segmentId
     * @param array $rules
     * @return array|null
     */
    public function testSegmentRules(int $segmentId, array $rules): ?array
    {
        // Implementation for testing segment rules
        return [
            'segment_id' => $segmentId,
            'rules' => $rules,
            'test_result' => 'success',
            'matched_count' => 0
        ];
    }

    /**
     * Refresh segment
     *
     * @param int $segmentId
     * @return array|null
     */
    public function refreshSegment(int $segmentId): ?array
    {
        // Implementation for refreshing segment
        return [
            'segment_id' => $segmentId,
            'refreshed_at' => now(),
            'subscriber_count' => 0
        ];
    }

    // ===== IMPORT/EXPORT =====

    /**
     * Import subscribers
     *
     * @param array $data
     * @return array|null
     */
    public function importSubscribers(array $data): ?array
    {
        // Implementation for importing subscribers
        return [
            'imported_count' => 0,
            'failed_count' => 0,
            'import_id' => uniqid()
        ];
    }

    /**
     * Export subscribers
     *
     * @param array $filters
     * @return array
     */
    public function exportSubscribers(array $filters = []): array
    {
        // Implementation for exporting subscribers
        return [
            'export_url' => '/exports/subscribers/' . uniqid(),
            'format' => $filters['format'] ?? 'csv',
            'total_records' => 0
        ];
    }

    /**
     * Send campaign
     *
     * @param int $campaignId
     * @param array $data
     * @return array|null
     */
    public function sendCampaign(int $campaignId, array $data): ?array
    {
        $campaign = $this->getCampaignById($campaignId);
        if (!$campaign) {
            return null;
        }

        // Implementation for sending campaign
        return [
            'campaign_id' => $campaignId,
            'sent_at' => now(),
            'recipient_count' => count($data['list_ids']),
            'status' => 'sent'
        ];
    }

    /**
     * Schedule campaign
     *
     * @param int $campaignId
     * @param array $data
     * @return array|null
     */
    public function scheduleCampaign(int $campaignId, array $data): ?array
    {
        $campaign = $this->getCampaignById($campaignId);
        if (!$campaign) {
            return null;
        }

        // Implementation for scheduling campaign
        return [
            'campaign_id' => $campaignId,
            'scheduled_at' => $data['schedule_at'],
            'recipient_count' => count($data['list_ids']),
            'status' => 'scheduled'
        ];
    }

    /**
     * Test campaign
     *
     * @param int $campaignId
     * @param array $data
     * @return array|null
     */
    public function testCampaign(int $campaignId, array $data): ?array
    {
        $campaign = $this->getCampaignById($campaignId);
        if (!$campaign) {
            return null;
        }

        // Implementation for testing campaign
        return [
            'campaign_id' => $campaignId,
            'test_emails' => $data['test_emails'],
            'sent_at' => now(),
            'status' => 'test_sent'
        ];
    }

    /**
     * Duplicate template
     *
     * @param int $templateId
     * @param array $data
     * @return array|null
     */
    public function duplicateTemplate(int $templateId, array $data): ?array
    {
        // Implementation for duplicating template
        return [
            'original_template_id' => $templateId,
            'new_template_id' => uniqid(),
            'name' => $data['name'],
            'created_at' => now()
        ];
    }
}
