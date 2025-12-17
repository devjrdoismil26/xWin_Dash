<?php

namespace App\Domains\Auth\Activities;

use App\Models\User; // Supondo o model de usuário padrão do Laravel
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;

class ValidateResetRequestActivity
{
    /**
     * Executa a atividade de validação de solicitação de reset de senha.
     *
     * @param array{email:string, token:string} $data dados da solicitação (ex: 'email', 'token')
     *
     * @return User o usuário associado à solicitação de reset
     *
     * @throws \Exception se a solicitação for inválida
     */
    public function execute(array $data): User
    {
        $email = $data['email'];
        $token = $data['token'];

        Log::info("Executando ValidateResetRequestActivity para o e-mail: {$email}.");

        if (!$email || !$token) {
            throw new \Exception("Dados de solicitação de reset inválidos: e-mail e token são obrigatórios.");
        }

        // Verificar se o token é válido e se o e-mail corresponde a um usuário
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception("Usuário não encontrado para o e-mail: {$email}.");
        }

        // Apenas checa se existe um usuário; a validação de token acontece em Password::reset

        Log::info("Solicitação de reset de senha validada com sucesso para o usuário ID: {$user->id}.");
        return $user;
    }

    /**
     * Não há compensação direta para esta atividade, pois é uma validação.
     *
     * @return bool
     */
    public function compensate(): bool
    {
        Log::info("Compensação não aplicável para ValidateResetRequestActivity.");
        return true;
    }
}
