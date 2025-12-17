<?php

namespace App\Domains\AI\Exceptions;

use Exception;
use Illuminate\Support\Facades\Response;

/**
 * Exceção lançada quando ocorre um erro com provedores de AI.
 */
class AIProviderException extends Exception
{
    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $message  a mensagem de erro
     * @param int             $code     o código de erro
     * @param \Throwable|null $previous a exceção anterior
     */
    public function __construct($message = "Erro no provedor de AI.", $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Renderiza a exceção em uma resposta HTTP.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request)
    {
        return Response::json([
            'error' => 'AIProviderError',
            'message' => 'Houve um problema com o provedor de AI. Tente novamente mais tarde.',
            'details' => $this->getMessage(),
        ], 502);
    }
}
