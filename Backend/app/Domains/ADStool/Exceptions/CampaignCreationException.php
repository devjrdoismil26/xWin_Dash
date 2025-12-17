<?php

namespace App\Domains\ADStool\Exceptions;

use Exception;

/**
 * Exceção lançada quando ocorre um erro durante o processo de criação de uma campanha.
 *
 * Usar uma exceção customizada permite um tratamento de erro mais específico e
 * intencional no código que chama os serviços de criação de campanha.
 */
class CampaignCreationException extends Exception
{
    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $message  a mensagem de erro
     * @param int             $code     o código de erro
     * @param \Throwable|null $previous a exceção anterior, se houver
     */
    public function __construct($message = "Falha ao criar a campanha.", $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Reporta a exceção (pode ser usado para logging customizado).
     */
    public function report(): void
    {
        // Exemplo: Log::error("Erro na criação de campanha: {$this->getMessage()}");
    }

    /**
     * Renderiza a exceção em uma resposta HTTP (opcional).
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request): \Illuminate\Http\JsonResponse
    {
        return \Illuminate\Support\Facades\Response::json([
            'error' => 'CampaignCreationError',
            'message' => $this->getMessage(),
        ], 500);
    }
}
