<?php

namespace App\Domains\ADStool\Exceptions;

use Exception;

/**
 * Exceção lançada quando a configuração para uma plataforma de anúncios está ausente ou é inválida.
 *
 * É usada para prevenir tentativas de chamada de API quando o sistema sabe de antemão
 * que as credenciais ou configurações necessárias não estão presentes, resultando em
 * uma falha rápida e clara.
 */
class PlatformConfigurationException extends Exception
{
    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $message  a mensagem de erro
     * @param int             $code     o código de erro
     * @param \Throwable|null $previous a exceção anterior
     */
    public function __construct($message = "A configuração da plataforma de anúncios está incompleta ou é inválida.", $code = 0, ?\Throwable $previous = null)
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
    public function render($request): \Illuminate\Http\JsonResponse
    {
        return \Illuminate\Support\Facades\Response::json([
            'error' => 'PlatformConfigurationError',
            'message' => $this->getMessage(),
        ], 500);
    }
}
