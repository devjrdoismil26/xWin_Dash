<?php

namespace App\Domains\Auth\Activities;

use App\Models\User; // Supondo o model de usuário padrão do Laravel
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;

class ValidateAndResetActivity
{
    /**
     * Executa a atividade de validação e reset de senha.
     *
     * @param array{email:string, token:string, password:string, password_confirmation?:string} $data
     *
     * @return User o usuário com a senha resetada
     *
     * @throws \Exception se a validação ou o reset falharem
     */
    public function execute(array $data): User
    {
        $email = $data['email'];
        $token = $data['token'];
        $password = $data['password'];

        Log::info("Executando ValidateAndResetActivity para o e-mail: {$email}.");

        if (!$email || !$token || !$password) {
            throw new \Exception("Dados de reset de senha inválidos: e-mail, token e senha são obrigatórios.");
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception("Usuário não encontrado para o e-mail: {$email}.");
        }

        // Validar e resetar a senha via Password::reset (respeita o contrato)
        $status = Password::reset(
            [
                'email' => $email,
                'token' => $token,
                'password' => $password,
                'password_confirmation' => $data['password_confirmation'] ?? $password,
            ],
            function (CanResetPasswordContract $resettable) use ($password): void {
                /** @var User $resettable */
                $resettable->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            $translated = __($status);
            $message = is_array($translated) ? 'password reset failed' : (string) $translated;
            throw new \Exception($message);
        }

        Log::info("Senha do usuário ID: {$user->id} resetada com sucesso.");
        return $user;
    }

    /**
     * Não há compensação direta para esta atividade, pois um reset de senha não é facilmente reversível.
     *
     * @return bool
     */
    public function compensate(): bool
    {
        Log::info("Compensação não aplicável para ValidateAndResetActivity.");
        return true;
    }
}
