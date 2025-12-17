<?php

namespace App\Domains\ADStool\Exceptions;

use Exception;

/**
 * Exceção lançada quando ocorre um erro na comunicação com a API do Facebook Ads.
 *
 * Isolar os erros da API do Facebook em uma exceção customizada permite que o código
 * que consome o serviço de integração trate essas falhas de forma específica,
 * por exemplo, implementando uma lógica de retry ou notificando a equipe técnica.
 */
class FacebookAdsApiException extends Exception
{
    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $message  a mensagem de erro retornada pela API ou pelo cliente HTTP
     * @param int             $code     o código de status HTTP ou código de erro da API
     * @param \Throwable|null $previous a exceção anterior
     */
    public function __construct($message = "Erro na API do Facebook Ads.", $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Reporta a exceção para os logs.
     */
    public function report(): void
    {
        // Adicionar contexto extra ao log, se necessário
        \Illuminate\Support\Facades\Log::channel('facebook_ads')->error($this->getMessage(), [
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
            'error' => 'FacebookAdsApiError',
            'message' => 'Houve um problema de comunicação com a plataforma do Facebook. Tente novamente mais tarde.',
            'details' => $this->getMessage(), // Apenas em ambiente de desenvolvimento
        ], 502); // 502 Bad Gateway é uma boa escolha para erros de upstream API
    }
}
