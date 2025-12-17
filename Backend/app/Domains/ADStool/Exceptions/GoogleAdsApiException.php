<?php

namespace App\Domains\ADStool\Exceptions;

use Exception;

/**
 * Exceção lançada quando ocorre um erro na comunicação com a API do Google Ads.
 *
 * Ter uma exceção específica para o Google Ads permite que o sistema identifique
 * e trate problemas com esta integração de forma isolada, facilitando o debug
 * e a implementação de políticas de retry ou de notificação de falhas.
 */
class GoogleAdsApiException extends Exception
{
    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $message  a mensagem de erro retornada pela API ou pelo cliente HTTP
     * @param int             $code     o código de status HTTP ou código de erro da API
     * @param \Throwable|null $previous a exceção anterior
     */
    public function __construct($message = "Erro na API do Google Ads.", $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Reporta a exceção para os logs.
     */
    public function report(): void
    {
        \Illuminate\Support\Facades\Log::channel('google_ads')->error($this->getMessage(), [
            'code' => $this->getCode(),
            'trace' => $this->getTraceAsString(),
        ]);
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
            'error' => 'GoogleAdsApiError',
            'message' => 'Houve um problema de comunicação com a plataforma do Google. Tente novamente mais tarde.',
            'details' => $this->getMessage(), // Apenas em ambiente de desenvolvimento
        ], 502); // 502 Bad Gateway
    }
}
