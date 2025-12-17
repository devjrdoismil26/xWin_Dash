<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma lista de e-mail é atualizada.
 */
class EmailListUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailList a lista de e-mail que foi atualizada
     */
    public EmailListModel $emailList;

    /**
     * Create a new event instance.
     *
     * @param EmailList $emailList
     */
    public function __construct(EmailListModel $emailList)
    {
        $this->emailList = $emailList;
    }
}
