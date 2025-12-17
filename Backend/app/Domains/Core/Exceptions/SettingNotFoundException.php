<?php

namespace App\Domains\Core\Exceptions;

use Exception;

class SettingNotFoundException extends Exception
{
    public function __construct(string $message = "Setting not found", int $code = 0, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}