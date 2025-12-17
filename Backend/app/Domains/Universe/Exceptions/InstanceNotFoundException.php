<?php

namespace App\Domains\Universe\Exceptions;

use Exception;
use Throwable;

class InstanceNotFoundException extends Exception
{
    public function __construct(string $message = "Universe instance not found.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
