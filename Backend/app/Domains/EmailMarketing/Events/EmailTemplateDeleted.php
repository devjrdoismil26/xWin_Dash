<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailTemplateModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um template de e-mail é deletado.
 */
class EmailTemplateDeleted
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailTemplate o template de e-mail que foi deletado
     */
    public EmailTemplateModel $emailTemplate;

    /**
     * Create a new event instance.
     *
     * @param EmailTemplate $emailTemplate
     */
    public function __construct(EmailTemplateModel $emailTemplate)
    {
        $this->emailTemplate = $emailTemplate;
    }
}
