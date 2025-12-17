<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailCampaignSegmentRepositoryInterface
{
    /**
     * Anexa um segmento a uma campanha de e-mail.
     *
     * @param int $campaignId
     * @param int $segmentId
     *
     * @return EmailCampaignSegment
     */
    public function attachSegment(int $campaignId, int $segmentId): EmailCampaignSegment;

    /**
     * Desanexa um segmento de uma campanha de e-mail.
     *
     * @param int $campaignId
     * @param int $segmentId
     *
     * @return bool
     */
    public function detachSegment(int $campaignId, int $segmentId): bool;

    /**
     * Obtém todos os segmentos anexados a uma campanha.
     *
     * @param int $campaignId
     *
     * @return array<EmailCampaignSegment>
     */
    public function getSegmentsByCampaignId(int $campaignId): array;
}
