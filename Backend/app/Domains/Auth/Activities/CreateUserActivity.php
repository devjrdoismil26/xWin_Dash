<?php

namespace App\Domains\Auth\Activities;

use App\Models\User; // Supondo o model de usuário padrão do Laravel
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class CreateUserActivity
{
    /**
     * Executa a atividade de criação de usuário.
     *
      * @param array{name:string, email:string, password:string} $userData
     *
     * @return User o usuário criado
     *
     * @throws \Exception se a criação do usuário falhar
     */
    public function execute(array $userData): User
    {
        Log::info("Executando CreateUserActivity para o e-mail: {$userData['email']}.");

        try {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                // Adicione outros campos padrão do usuário aqui
            ]);

            Log::info("Usuário ID: {$user->id} criado com sucesso.");
            return $user;
        } catch (\Exception $e) {
            Log::error("Falha ao criar usuário para o e-mail: {$userData['email']}. Erro: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Compensa a atividade de criação de usuário em caso de falha da saga.
     *
     * @param User $user o usuário que foi criado e precisa ser compensado
     *
     * @return bool
     */
    public function compensate(User $user): bool
    {
        Log::warning("Compensando CreateUserActivity: Deletando usuário ID: {$user->id}.");
        try {
            $user->delete();
            Log::info("Usuário ID: {$user->id} deletado com sucesso como parte da compensação.");
            return true;
        } catch (\Exception $e) {
            Log::error("Falha ao compensar CreateUserActivity para usuário ID: {$user->id}. Erro: " . $e->getMessage());
            return false;
        }
    }
}
