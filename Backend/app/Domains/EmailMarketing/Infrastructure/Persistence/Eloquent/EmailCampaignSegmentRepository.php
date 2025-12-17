<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailCampaignSegment;
use App\Domains\EmailMarketing\Domain\EmailCampaignSegmentRepositoryInterface;

class EmailCampaignSegmentRepository implements EmailCampaignSegmentRepositoryInterface
{
    protected EmailCampaignSegmentModel $model;

    public function __construct(EmailCampaignSegmentModel $model)
    {
        $this->model = $model;
    }

    /**
     * Anexa um segmento a uma campanha de e-mail.
     *
     * @param int $campaignId
     * @param int $segmentId
     *
     * @return EmailCampaignSegment
     */
    public function attachSegment(int $campaignId, int $segmentId): EmailCampaignSegment
    {
        $segmentModel = $this->model->create([
            'campaign_id' => $campaignId,
            'segment_id' => $segmentId,
        ]);
        return EmailCampaignSegment::fromArray($segmentModel->toArray());
    }

    /**
     * Desanexa um segmento de uma campanha de e-mail.
     *
     * @param int $campaignId
     * @param int $segmentId
     *
     * @return bool
     */
    public function detachSegment(int $campaignId, int $segmentId): bool
    {
        return (bool) $this->model->where('campaign_id', $campaignId)
                                 ->where('segment_id', $segmentId)
                                 ->delete();
    }

    /**
     * Obtém todos os segmentos anexados a uma campanha.
     *
     * @param int $campaignId
     *
     * @return array<EmailCampaignSegment>
     */
    public function getSegmentsByCampaignId(int $campaignId): array
    {
        return $this->model->where('campaign_id', $campaignId)
                           ->get()
                           ->map(function ($item) {
                               return EmailCampaignSegment::fromArray($item->toArray());
                           })->toArray();
    }
}
