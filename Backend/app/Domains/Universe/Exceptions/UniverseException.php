<?php

namespace App\Domains\Universe\Exceptions;

use Exception;
use Throwable;

class UniverseException extends Exception
{
    public function __construct(string $message = "An error occurred in the Universe module.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
