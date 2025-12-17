<?php

namespace App\Domains\Analytics\Providers;

use App\Domains\Analytics\Events\AnalyticReportGenerated;
use App\Domains\Analytics\Events\AnalyticReportUpdated;
use App\Domains\Analytics\Listeners\LeadStatusChangedListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        AnalyticReportGenerated::class => [
            // Listener para quando um relatório analítico é gerado
        ],
        AnalyticReportUpdated::class => [
            // Listener para quando um relatório analítico é atualizado
        ],
        // O LeadStatusChangedListener está listado, então vamos adicioná-lo aqui.
        // Assumindo que ele reage a um evento de mudança de status de Lead, que viria do módulo Leads.
        // Por exemplo: \App\Domains\Leads\Events\LeadStatusChanged::class => [
        //     LeadStatusChangedListener::class,
        // ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot()
    {
        parent::boot();
    }
}
