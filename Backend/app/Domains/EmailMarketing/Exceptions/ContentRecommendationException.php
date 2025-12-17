<?php

namespace App\Domains\EmailMarketing\Exceptions;

use Exception;
use Throwable;

class ContentRecommendationException extends Exception
{
    public function __construct(string $message = "Failed to generate content recommendations.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
