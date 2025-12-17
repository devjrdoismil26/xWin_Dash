<?php

namespace App\Domains\Analytics\Observers;

use App\Domains\Analytics\Events\AnalyticReportGenerated;
use App\Domains\Analytics\Events\AnalyticReportUpdated;
use App\Domains\Analytics\Models\AnalyticReport;

class AnalyticReportObserver
{
    /**
     * Handle the AnalyticReport "created" event.
     *
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     */
    public function created(AnalyticReport $analyticReport)
    {
        AnalyticReportGenerated::dispatch($analyticReport);
    }

    /**
     * Handle the AnalyticReport "updated" event.
     *
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     */
    public function updated(AnalyticReport $analyticReport)
    {
        AnalyticReportUpdated::dispatch($analyticReport);
    }

    /**
     * Handle the AnalyticReport "deleted" event.
     *
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     */
    public function deleted(AnalyticReport $analyticReport)
    {
        //
    }

    /**
     * Handle the AnalyticReport "restored" event.
     *
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     */
    public function restored(AnalyticReport $analyticReport)
    {
        //
    }

    /**
     * Handle the AnalyticReport "forceDeleted" event.
     *
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     */
    public function forceDeleted(AnalyticReport $analyticReport)
    {
        //
    }
}
