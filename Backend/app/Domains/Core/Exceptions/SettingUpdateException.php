<?php

namespace App\Domains\Core\Exceptions;

use Exception;

class SettingUpdateException extends Exception
{
    public function __construct(string $message = "Failed to update setting", int $code = 0, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}