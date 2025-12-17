<?php

namespace App\Domains\Auth\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class TooManyLoginAttemptsException extends Exception
{
    protected $code = 429;

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'error' => 'too_many_attempts',
        ], $this->code);
    }
}
