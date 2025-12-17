<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailTemplateCreated;
use App\Domains\EmailMarketing\Events\EmailTemplateDeleted;
use App\Domains\EmailMarketing\Events\EmailTemplateUpdated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailTemplateModel;

class EmailTemplateObserver
{
    /**
     * Handle the EmailTemplateModel "created" event.
     *
     * @param EmailTemplateModel $emailTemplate
     */
    public function created(EmailTemplateModel $emailTemplate): void
    {
        EmailTemplateCreated::dispatch($emailTemplate);
    }

    /**
     * Handle the EmailTemplateModel "updated" event.
     *
     * @param EmailTemplateModel $emailTemplate
     */
    public function updated(EmailTemplateModel $emailTemplate): void
    {
        EmailTemplateUpdated::dispatch($emailTemplate);
    }

    /**
     * Handle the EmailTemplateModel "deleted" event.
     *
     * @param EmailTemplateModel $emailTemplate
     */
    public function deleted(EmailTemplateModel $emailTemplate): void
    {
        EmailTemplateDeleted::dispatch($emailTemplate);
    }

    /**
     * Handle the EmailTemplateModel "restored" event.
     *
     * @param EmailTemplateModel $emailTemplate
     */
    public function restored(EmailTemplateModel $emailTemplate): void
    {
        //
    }

    /**
     * Handle the EmailTemplateModel "forceDeleted" event.
     *
     * @param EmailTemplateModel $emailTemplate
     */
    public function forceDeleted(EmailTemplateModel $emailTemplate): void
    {
        //
    }
}
