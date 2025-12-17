<?php

namespace App\Domains\Media\Providers;

use App\Domains\Media\Contracts\MediaRepositoryInterface;
use App\Domains\Media\Domain\FolderRepositoryInterface;
use App\Domains\Media\Infrastructure\Persistence\Eloquent\FolderRepository;
use App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaRepository;
use Illuminate\Support\ServiceProvider;

class MediaDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            MediaRepositoryInterface::class,
            MediaRepository::class,
        );

        $this->app->bind(
            FolderRepositoryInterface::class,
            FolderRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
