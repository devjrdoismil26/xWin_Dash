<?php

namespace App\Domains\Auth\Activities;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Workflow\Activity;

class AssignDefaultRoleActivity extends Activity
{
    /**
     * Atribui a role 'user' a um usuário recém-criado.
     *
     * @param User $user o usuário ao qual a role será atribuída
     *
     * @throws \Exception se a role 'user' não for encontrada, indicando um erro de configuração
     */
    public function execute(User $user): void
    {
        $userRole = Role::query()->where('name', 'user')->first();

        if (!$userRole) {
            // Lançamos uma exceção para interromper o workflow se a role não existir.
            // Isso é um erro crítico de configuração do sistema.
            throw new \Exception('Erro de configuração: a role de usuário padrão não foi encontrada.');
        }

        $user->assignRole($userRole);
    }

    /**
     * Compensa a atribuição da role, removendo-a do usuário.
     */
    public function compensate(User $user): void
    {
        // Remover a role padrão atribuída
        $user->removeRole('user');
    }
}
