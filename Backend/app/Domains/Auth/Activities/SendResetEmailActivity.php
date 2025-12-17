<?php

namespace App\Domains\Auth\Activities;

use Illuminate\Support\Facades\Password;
use Workflow\Activity;

class SendResetEmailActivity extends Activity
{
    /**
     * Tenta enviar o link de redefinição de senha para o e-mail fornecido.
     *
     * @param array{email:string} $data deve conter a chave 'email'
     *
     * @return string o status da operação (ex: Password::RESET_LINK_SENT)
     */
    public function execute(array $data): string
    {
        return Password::sendResetLink($data);
    }
}
