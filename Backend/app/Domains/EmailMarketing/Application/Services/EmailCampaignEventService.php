<?php

namespace App\Domains\EmailMarketing\Application\Services;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\EmailCampaignCreatedEvent;
use App\Shared\Events\EmailCampaignUpdatedEvent;
use App\Shared\Events\EmailCampaignDeletedEvent;
use App\Shared\Events\EmailCampaignSentEvent;
use App\Shared\Events\EmailCampaignPausedEvent;
use App\Shared\Events\EmailCampaignResumedEvent;
use Illuminate\Support\Facades\Log;

/**
 * 📢 Email Campaign Event Service
 *
 * Serviço especializado para eventos de campanhas de email
 * Responsável por disparar eventos relacionados a campanhas
 */
class EmailCampaignEventService
{
    public function __construct(
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    /**
     * Disparar evento de campanha criada
     */
    public function dispatchCampaignCreated(EmailCampaign $campaign): void
    {
        try {
            $event = new EmailCampaignCreatedEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->priority->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $campaign->createdAt?->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign created event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign created event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha atualizada
     */
    public function dispatchCampaignUpdated(EmailCampaign $campaign, array $changes = []): void
    {
        try {
            $event = new EmailCampaignUpdatedEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->priority->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $changes,
                $campaign->updatedAt?->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign updated event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'changes' => $changes
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign updated event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha deletada
     */
    public function dispatchCampaignDeleted(int $campaignId, string $campaignName, int $userId): void
    {
        try {
            $event = new EmailCampaignDeletedEvent(
                $campaignId,
                $campaignName,
                $userId,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign deleted event dispatched', [
                'campaign_id' => $campaignId,
                'campaign_name' => $campaignName,
                'user_id' => $userId
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign deleted event: ' . $e->getMessage(), [
                'campaign_id' => $campaignId
            ]);
        }
    }

    /**
     * Disparar evento de campanha enviada
     */
    public function dispatchCampaignSent(EmailCampaign $campaign, int $recipientCount, array $stats = []): void
    {
        try {
            $event = new EmailCampaignSentEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $recipientCount,
                $stats,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign sent event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'recipient_count' => $recipientCount
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign sent event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha pausada
     */
    public function dispatchCampaignPaused(EmailCampaign $campaign, string $reason = ''): void
    {
        try {
            $event = new EmailCampaignPausedEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $reason,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign paused event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'reason' => $reason
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign paused event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha retomada
     */
    public function dispatchCampaignResumed(EmailCampaign $campaign): void
    {
        try {
            $event = new EmailCampaignResumedEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign resumed event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign resumed event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha agendada
     */
    public function dispatchCampaignScheduled(EmailCampaign $campaign, string $scheduledAt): void
    {
        try {
            $event = new EmailCampaignScheduledEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $scheduledAt,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign scheduled event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'scheduled_at' => $scheduledAt
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign scheduled event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha cancelada
     */
    public function dispatchCampaignCancelled(EmailCampaign $campaign, string $reason = ''): void
    {
        try {
            $event = new EmailCampaignCancelledEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $reason,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign cancelled event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'reason' => $reason
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign cancelled event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha com erro
     */
    public function dispatchCampaignError(EmailCampaign $campaign, string $error, array $context = []): void
    {
        try {
            $event = new EmailCampaignErrorEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $error,
                $context,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::error('Email campaign error event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'error' => $error,
                'context' => $context
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign error event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha concluída
     */
    public function dispatchCampaignCompleted(EmailCampaign $campaign, array $finalStats = []): void
    {
        try {
            $event = new EmailCampaignCompletedEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $finalStats,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::info('Email campaign completed event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'final_stats' => $finalStats
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign completed event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }

    /**
     * Disparar evento de campanha com baixa performance
     */
    public function dispatchCampaignLowPerformance(EmailCampaign $campaign, array $performanceData = []): void
    {
        try {
            $event = new EmailCampaignLowPerformanceEvent(
                $campaign->id,
                $campaign->name,
                $campaign->type->getValue(),
                $campaign->userId,
                $campaign->emailListId,
                $performanceData,
                now()->toISOString()
            );

            $this->eventDispatcher->dispatch($event);

            Log::warning('Email campaign low performance event dispatched', [
                'campaign_id' => $campaign->id,
                'campaign_name' => $campaign->name,
                'user_id' => $campaign->userId,
                'performance_data' => $performanceData
            ]);
        } catch (\Exception $e) {
            Log::error('Error dispatching campaign low performance event: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id
            ]);
        }
    }
}
