<?php

namespace App\Domains\Core\Exceptions;

use Exception;
use Illuminate\Support\Facades\Response;
use Throwable;

class ExternalServiceException extends Exception
{
    public function __construct(string $message = "Erro ao comunicar com serviço externo.", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Report the exception.
     */
    public function report()
    {
        // Logar a exceção ou enviar para um serviço de monitoramento de erros
        // Log::error('External Service Error: ' . $this->getMessage());
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request)
    {
        return Response::json([
            'error' => 'External Service Error',
            'message' => $this->getMessage(),
        ], 503); // Service Unavailable
    }
}
