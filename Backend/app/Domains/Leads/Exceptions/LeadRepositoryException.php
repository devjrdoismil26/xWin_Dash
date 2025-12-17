<?php

namespace App\Domains\Leads\Exceptions;

use Exception;
use Throwable;

class LeadRepositoryException extends Exception
{
    public function __construct(string $message = "An error occurred in the Lead Repository.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
