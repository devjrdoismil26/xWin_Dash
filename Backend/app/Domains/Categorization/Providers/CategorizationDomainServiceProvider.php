<?php

namespace App\Domains\Categorization\Providers;

use App\Domains\Categorization\Domain\TagRepositoryInterface;
use App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagRepository;
use Illuminate\Support\ServiceProvider;

class CategorizationDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            TagRepositoryInterface::class,
            TagRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
