<?php

namespace App\Domains\Auth\Workflows;

use App\Domains\Auth\Activities\AssignDefaultRoleActivity;
use App\Domains\Auth\Activities\CreateUserActivity;
use App\Domains\Auth\Activities\SendVerificationEmailActivity;
use App\Domains\Auth\Activities\ValidateRegistrationDataActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class UserRegistrationWorkflow extends Workflow
{
    /**
     * @param array{name:string, email:string, password:string, password_confirmation?:string} $data
     * @return \App\Models\User
     */
    public function definition(array $data)
    {
        // 1. Validar os dados de entrada
        $validatedData = yield ActivityStub::make(ValidateRegistrationDataActivity::class, $data);

        // 2. Criar o usuário no banco de dados
        $user = yield ActivityStub::make(CreateUserActivity::class, $validatedData);

        // 3. Atribuir a role padrão ao novo usuário
        yield ActivityStub::make(AssignDefaultRoleActivity::class, $user);

        // 4. Enviar o e-mail de verificação
        yield ActivityStub::make(SendVerificationEmailActivity::class, $user);

        return $user;
    }
}
