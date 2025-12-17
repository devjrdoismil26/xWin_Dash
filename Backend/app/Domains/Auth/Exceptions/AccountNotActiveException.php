<?php

namespace App\Domains\Auth\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class AccountNotActiveException extends Exception
{
    protected $code = 403;

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'error' => 'account_not_active',
        ], $this->code);
    }
}
