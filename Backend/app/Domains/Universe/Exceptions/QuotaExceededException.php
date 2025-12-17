<?php

namespace App\Domains\Universe\Exceptions;

use Exception;

class QuotaExceededException extends Exception
{
    public function __construct(string $message = "Quota exceeded", int $code = 429, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
