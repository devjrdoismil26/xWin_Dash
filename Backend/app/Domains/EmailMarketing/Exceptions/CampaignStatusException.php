<?php

namespace App\Domains\EmailMarketing\Exceptions;

use Exception;
use Throwable;

class CampaignStatusException extends Exception
{
    public function __construct(string $message = "Invalid campaign status for this operation.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
