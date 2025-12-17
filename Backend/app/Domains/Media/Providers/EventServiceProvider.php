<?php

namespace App\Domains\Media\Providers;

use App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaModel as Media;
use App\Domains\Media\Observers\MediaObserver;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
    ];

    public function boot(): void
    {
        Media::observe(MediaObserver::class);
        \App\Domains\Media\Infrastructure\Persistence\Eloquent\FolderModel::observe(\App\Domains\Media\Observers\FolderObserver::class);
    }
}
