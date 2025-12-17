<?php

namespace App\Domains\Auth\Workflows;

use App\Domains\Auth\Activities\SendResetEmailActivity;
use App\Domains\Auth\Activities\ValidateResetRequestActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class PasswordResetWorkflow extends Workflow
{
    /**
     * Orquestra o processo de envio de link para redefinição de senha.
     *
     * @param array $data deve conter a chave 'email'
     *
     * @return mixed o status retornado pela operação de envio
     */
    /**
     * @param array{email:string} $data
     * @return string
     */
    public function definition(array $data): string
    {
        // 1. Valida a requisição (basicamente, se o e-mail foi fornecido)
        $validatedData = yield ActivityStub::make(ValidateResetRequestActivity::class, $data);

        // 2. Envia o link de redefinição de senha
        $status = yield ActivityStub::make(SendResetEmailActivity::class, $validatedData);

        return $status;
    }
}
