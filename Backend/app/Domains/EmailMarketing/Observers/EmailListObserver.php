<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailListCreated;
use App\Domains\EmailMarketing\Events\EmailListDeleted;
use App\Domains\EmailMarketing\Events\EmailListUpdated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListModel;

class EmailListObserver
{
    /**
     * Handle the EmailListModel "created" event.
     *
     * @param EmailListModel $emailList
     */
    public function created(EmailListModel $emailList): void
    {
        EmailListCreated::dispatch($emailList); // Supondo um método toDomainEntity()
    }

    /**
     * Handle the EmailListModel "updated" event.
     *
     * @param EmailListModel $emailList
     */
    public function updated(EmailListModel $emailList): void
    {
        EmailListUpdated::dispatch($emailList);
    }

    /**
     * Handle the EmailListModel "deleted" event.
     *
     * @param EmailListModel $emailList
     */
    public function deleted(EmailListModel $emailList): void
    {
        EmailListDeleted::dispatch($emailList);
    }

    /**
     * Handle the EmailListModel "restored" event.
     *
     * @param EmailListModel $emailList
     */
    public function restored(EmailListModel $emailList): void
    {
        //
    }

    /**
     * Handle the EmailListModel "forceDeleted" event.
     *
     * @param EmailListModel $emailList
     */
    public function forceDeleted(EmailListModel $emailList): void
    {
        //
    }
}
