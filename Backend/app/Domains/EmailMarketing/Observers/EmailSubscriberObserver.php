<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailSubscriberCreated;
use App\Domains\EmailMarketing\Events\EmailSubscriberDeleted;
use App\Domains\EmailMarketing\Events\EmailSubscriberStatusChanged;
use App\Domains\EmailMarketing\Events\EmailSubscriberUpdated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSubscriberModel;

class EmailSubscriberObserver
{
    /**
     * Handle the EmailSubscriberModel "created" event.
     *
     * @param EmailSubscriberModel $emailSubscriber
     */
    public function created(EmailSubscriberModel $emailSubscriber): void
    {
        EmailSubscriberCreated::dispatch($emailSubscriber);
    }

    /**
     * Handle the EmailSubscriberModel "updated" event.
     *
     * @param EmailSubscriberModel $emailSubscriber
     */
    public function updated(EmailSubscriberModel $emailSubscriber): void
    {
        EmailSubscriberUpdated::dispatch($emailSubscriber);

        // Disparar evento de mudança de status se o status foi alterado
        if ($emailSubscriber->isDirty('status')) {
            EmailSubscriberStatusChanged::dispatch($emailSubscriber, $emailSubscriber->status);
        }
    }

    /**
     * Handle the EmailSubscriberModel "deleted" event.
     *
     * @param EmailSubscriberModel $emailSubscriber
     */
    public function deleted(EmailSubscriberModel $emailSubscriber): void
    {
        EmailSubscriberDeleted::dispatch($emailSubscriber);
    }

    /**
     * Handle the EmailSubscriberModel "restored" event.
     *
     * @param EmailSubscriberModel $emailSubscriber
     */
    public function restored(EmailSubscriberModel $emailSubscriber): void
    {
        //
    }

    /**
     * Handle the EmailSubscriberModel "forceDeleted" event.
     *
     * @param EmailSubscriberModel $emailSubscriber
     */
    public function forceDeleted(EmailSubscriberModel $emailSubscriber): void
    {
        //
    }
}
