<?php

namespace App\Domains\AI\Exceptions;

use Exception;

class PyLabException extends Exception
{
    public function __construct(string $message = "", int $code = 0, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Renderizar exceção para resposta HTTP
     */
    public function render()
    {
        return response()->json([
            'error' => 'PyLab Service Error',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
            'timestamp' => now()->toISOString()
        ], $this->getCode() ?: 500);
    }
}
