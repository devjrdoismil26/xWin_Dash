<?php

namespace App\Domains\Auth\Activities;

use App\Domains\Users\Models\User;
use Illuminate\Auth\Events\Registered;
use Workflow\Activity;

class SendVerificationEmailActivity extends Activity
{
    /**
     * Dispara o evento para enviar o e-mail de verificação.
     * A lógica de envio de e-mail em si é tratada por um Listener do evento Registered;
     * mantendo a responsabilidade desacoplada da activity.
     *
     * @param User $user o usuário para quem o e-mail será enviado
     */
    public function execute(User $user): void
    {
        event(new Registered($user));
    }

    /**
     * A compensação para o envio de um e-mail geralmente não é aplicável.
     * Uma vez que o e-mail é enviado, não é possível "desenviá-lo".
     * Poderíamos registrar um log aqui, se necessário.
     */
    public function compensate(): void
    {
        // Nenhuma ação de compensação é necessária.
    }
}
