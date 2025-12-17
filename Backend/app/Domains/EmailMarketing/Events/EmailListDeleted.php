<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma lista de e-mail é deletada.
 */
class EmailListDeleted
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailList a lista de e-mail que foi deletada
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
