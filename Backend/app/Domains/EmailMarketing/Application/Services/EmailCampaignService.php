<?php

namespace App\Domains\EmailMarketing\Application\Services;

use App\Domains\EmailMarketing\Application\UseCases\CreateEmailCampaignUseCase;
use App\Domains\EmailMarketing\Application\UseCases\UpdateEmailCampaignUseCase;
use App\Domains\EmailMarketing\Application\UseCases\DeleteEmailCampaignUseCase;
use App\Domains\EmailMarketing\Application\UseCases\GetEmailCampaignUseCase;
use App\Domains\EmailMarketing\Application\UseCases\ListEmailCampaignsUseCase;
use App\Domains\EmailMarketing\Application\UseCases\SendEmailCampaignUseCase;
use App\Domains\EmailMarketing\Application\Commands\CreateEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Commands\UpdateEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Commands\DeleteEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Commands\SendEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Queries\GetEmailCampaignQuery;
use App\Domains\EmailMarketing\Application\Queries\ListEmailCampaignsQuery;
use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para operações de campanhas de email
 */
class EmailCampaignService
{
    private CreateEmailCampaignUseCase $createCampaignUseCase;
    private UpdateEmailCampaignUseCase $updateCampaignUseCase;
    private DeleteEmailCampaignUseCase $deleteCampaignUseCase;
    private GetEmailCampaignUseCase $getCampaignUseCase;
    private ListEmailCampaignsUseCase $listCampaignsUseCase;
    private SendEmailCampaignUseCase $sendCampaignUseCase;

    public function __construct(
        CreateEmailCampaignUseCase $createCampaignUseCase,
        UpdateEmailCampaignUseCase $updateCampaignUseCase,
        DeleteEmailCampaignUseCase $deleteCampaignUseCase,
        GetEmailCampaignUseCase $getCampaignUseCase,
        ListEmailCampaignsUseCase $listCampaignsUseCase,
        SendEmailCampaignUseCase $sendCampaignUseCase
    ) {
        $this->createCampaignUseCase = $createCampaignUseCase;
        $this->updateCampaignUseCase = $updateCampaignUseCase;
        $this->deleteCampaignUseCase = $deleteCampaignUseCase;
        $this->getCampaignUseCase = $getCampaignUseCase;
        $this->listCampaignsUseCase = $listCampaignsUseCase;
        $this->sendCampaignUseCase = $sendCampaignUseCase;
    }

    /**
     * Cria uma nova campanha de email
     */
    public function createCampaign(array $data): array
    {
        try {
            $command = CreateEmailCampaignCommand::fromArray($data);
            return $this->createCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::createCampaign', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma campanha de email existente
     */
    public function updateCampaign(int $campaignId, array $data): array
    {
        try {
            $command = UpdateEmailCampaignCommand::fromArray(array_merge($data, ['id' => $campaignId]));
            return $this->updateCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::updateCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma campanha de email
     */
    public function deleteCampaign(int $campaignId): array
    {
        try {
            $command = DeleteEmailCampaignCommand::fromArray(['id' => $campaignId]);
            return $this->deleteCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::deleteCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma campanha de email por ID
     */
    public function getCampaign(int $campaignId): array
    {
        try {
            $query = GetEmailCampaignQuery::fromArray(['id' => $campaignId]);
            return $this->getCampaignUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::getCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista campanhas de email com filtros
     */
    public function listCampaigns(array $filters = []): array
    {
        try {
            $query = ListEmailCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::listCampaigns', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Envia uma campanha de email
     */
    public function sendCampaign(int $campaignId, array $options = []): array
    {
        try {
            $command = SendEmailCampaignCommand::fromArray(array_merge($options, ['id' => $campaignId]));
            return $this->sendCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::sendCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId,
                'options' => $options
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de campanhas
     */
    public function getCampaignStats(int $campaignId): array
    {
        try {
            $cacheKey = "email_campaign_stats_{$campaignId}";

            return Cache::remember($cacheKey, 300, function () use ($campaignId) {
                $campaign = $this->getCampaign($campaignId);

                return [
                    'campaign_id' => $campaignId,
                    'name' => $campaign['name'] ?? 'N/A',
                    'status' => $campaign['status'] ?? 'unknown',
                    'total_recipients' => $campaign['total_recipients'] ?? 0,
                    'sent_count' => $campaign['sent_count'] ?? 0,
                    'delivered_count' => $campaign['delivered_count'] ?? 0,
                    'opened_count' => $campaign['opened_count'] ?? 0,
                    'clicked_count' => $campaign['clicked_count'] ?? 0,
                    'bounced_count' => $campaign['bounced_count'] ?? 0,
                    'unsubscribed_count' => $campaign['unsubscribed_count'] ?? 0,
                    'open_rate' => $this->calculateOpenRate($campaign),
                    'click_rate' => $this->calculateClickRate($campaign),
                    'bounce_rate' => $this->calculateBounceRate($campaign),
                    'unsubscribe_rate' => $this->calculateUnsubscribeRate($campaign),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailCampaignService::getCampaignStats', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Calcula taxa de abertura
     */
    private function calculateOpenRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $openedCount = $campaign['opened_count'] ?? 0;

        return $sentCount > 0 ? ($openedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calcula taxa de cliques
     */
    private function calculateClickRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $clickedCount = $campaign['clicked_count'] ?? 0;

        return $sentCount > 0 ? ($clickedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calcula taxa de bounce
     */
    private function calculateBounceRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $bouncedCount = $campaign['bounced_count'] ?? 0;

        return $sentCount > 0 ? ($bouncedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calcula taxa de unsubscribe
     */
    private function calculateUnsubscribeRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $unsubscribedCount = $campaign['unsubscribed_count'] ?? 0;

        return $sentCount > 0 ? ($unsubscribedCount / $sentCount) * 100 : 0;
    }
}
