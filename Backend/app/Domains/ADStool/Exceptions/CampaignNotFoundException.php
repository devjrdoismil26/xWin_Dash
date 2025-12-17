<?php

namespace App\Domains\ADStool\Exceptions;

use Exception;

/**
 * Exception lançada quando uma campanha não é encontrada.
 */
class CampaignNotFoundException extends Exception
{
    /**
     * Cria uma nova instância da exception.
     *
     * @param string $campaignId
     */
    public function __construct(string $campaignId)
    {
        parent::__construct("Campaign with ID {$campaignId} not found.");
    }
}
