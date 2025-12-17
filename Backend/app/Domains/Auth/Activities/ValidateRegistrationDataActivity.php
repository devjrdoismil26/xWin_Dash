<?php

namespace App\Domains\Auth\Activities;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator; // Para regras de senha
use Illuminate\Validation\Rules\Password;

class ValidateRegistrationDataActivity
{
    /**
     * Executa a atividade de validação de dados de registro de usuário.
     *
     * @param array{name:string, email:string, password:string, password_confirmation?:string} $userData
     *
     * @return array{name:string, email:string, password:string, password_confirmation?:string} os dados validados
     *
     * @throws \Illuminate\Validation\ValidationException se a validação falhar
     */
    public function execute(array $userData): array
    {
        $email = (string) $userData['email'];
        Log::info("Executando ValidateRegistrationDataActivity para o e-mail: {$email}.");

        $validator = Validator::make($userData, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            Log::error("Falha na validação dos dados de registro: " . json_encode($validator->errors()->toArray()));
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        Log::info("Dados de registro validados com sucesso para o e-mail: {$email}.");
        /** @var array{name:string, email:string, password:string, password_confirmation?:string} $validated */
        $validated = $validator->validated();
        return $validated;
    }

    /**
     * Não há compensação direta para esta atividade, pois é uma validação.
     *
     * @return bool
     */
    public function compensate(): bool
    {
        Log::info("Compensação não aplicável para ValidateRegistrationDataActivity.");
        return true;
    }
}
