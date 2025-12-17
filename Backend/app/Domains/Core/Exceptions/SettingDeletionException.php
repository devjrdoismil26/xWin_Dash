<?php

namespace App\Domains\Core\Exceptions;

use Exception;

class SettingDeletionException extends Exception
{
    public function __construct(string $message = "Failed to delete setting", int $code = 0, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}