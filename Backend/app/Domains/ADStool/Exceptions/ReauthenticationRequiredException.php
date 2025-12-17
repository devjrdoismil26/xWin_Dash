<?php

namespace App\Domains\ADStool\Exceptions;

use Exception;

/**
 * Exceção lançada quando uma chamada de API falha porque o token de autenticação expirou ou foi revogado.
 *
 * Este é um erro de API recuperável, mas que exige ação do usuário. O sistema deve
 * capturar esta exceção para invalidar as credenciais salvas e guiar o usuário
 * para o fluxo de reautenticação com a plataforma externa.
 */
class ReauthenticationRequiredException extends Exception
{
    /**
     * @var string o nome da plataforma que requer reautenticação
     */
    public string $platform;

    /**
     * Cria uma nova instância da exceção.
     *
     * @param string          $platform o nome da plataforma (ex: 'facebook', 'google')
     * @param string          $message  a mensagem de erro
     * @param int             $code     o código de erro
     * @param \Throwable|null $previous a exceção anterior
     */
    public function __construct($platform, $message = "A autenticação expirou. Por favor, conecte-se novamente.", $code = 401, ?\Throwable $previous = null)
    {
        $this->platform = $platform;
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
            'error' => 'ReauthenticationRequired',
            'platform' => $this->platform,
            'message' => $this->getMessage(),
        ], 401);
    }
}
