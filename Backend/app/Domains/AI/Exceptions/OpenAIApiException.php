<?php

namespace App\Domains\AI\Exceptions;

use Exception;
use Illuminate\Support\Facades\Response;

/**
 * Exceção lançada quando ocorre um erro na comunicação com a API da OpenAI.
 */
class OpenAIApiException extends Exception
{
    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $message  a mensagem de erro retornada pela API ou pelo cliente HTTP
     * @param int             $code     o código de status HTTP ou código de erro da API
     * @param \Throwable|null $previous a exceção anterior
     */
    public function __construct($message = "Erro na API da OpenAI.", $code = 0, ?\Throwable $previous = null)
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
            'error' => 'OpenAIApiError',
            'message' => 'Houve um problema de comunicação com a plataforma da OpenAI. Tente novamente mais tarde.',
            'details' => $this->getMessage(),
        ], 502); // 502 Bad Gateway é uma boa escolha para erros de upstream API
    }
}
