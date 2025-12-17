<?php

namespace App\Domains\EmailMarketing\Exceptions;

use Exception;
use Throwable;

class SubjectOptimizationException extends Exception
{
    public function __construct(string $message = "Failed to optimize email subject.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
