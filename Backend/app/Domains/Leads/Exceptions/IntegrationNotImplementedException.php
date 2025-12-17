<?php

namespace App\Domains\Leads\Exceptions;

use Exception;
use Throwable;

class IntegrationNotImplementedException extends Exception
{
    public function __construct(string $message = "The requested integration is not implemented.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
