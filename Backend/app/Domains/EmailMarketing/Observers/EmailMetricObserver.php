<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailMetricCreated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailMetricModel;

class EmailMetricObserver
{
    /**
     * Handle the EmailMetricModel "created" event.
     *
     * @param EmailMetricModel $emailMetric
     */
    public function created(EmailMetricModel $emailMetric): void
    {
        EmailMetricCreated::dispatch($emailMetric);
    }

    /**
     * Handle the EmailMetricModel "updated" event.
     *
     * @param EmailMetricModel $emailMetric
     */
    public function updated(EmailMetricModel $emailMetric): void
    {
        //
    }

    /**
     * Handle the EmailMetricModel "deleted" event.
     *
     * @param EmailMetricModel $emailMetric
     */
    public function deleted(EmailMetricModel $emailMetric): void
    {
        //
    }

    /**
     * Handle the EmailMetricModel "restored" event.
     *
     * @param EmailMetricModel $emailMetric
     */
    public function restored(EmailMetricModel $emailMetric): void
    {
        //
    }

    /**
     * Handle the EmailMetricModel "forceDeleted" event.
     *
     * @param EmailMetricModel $emailMetric
     */
    public function forceDeleted(EmailMetricModel $emailMetric): void
    {
        //
    }
}
