<?php

namespace App\Domains\Activity\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        // Exemplo:
        // \App\Domains\Activity\Events\ActivityLogged::class => [
        //     \App\Domains\Activity\Listeners\LogActivityToDatabase::class,
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
