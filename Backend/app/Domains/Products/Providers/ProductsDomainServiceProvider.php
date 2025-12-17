<?php

namespace App\Domains\Products\Providers;

use App\Domains\Products\Domain\LandingPageRepositoryInterface;
use App\Domains\Products\Domain\LeadCaptureFormRepositoryInterface;
use App\Domains\Products\Domain\ProductRepositoryInterface;
use App\Domains\Products\Domain\ProductVariationRepositoryInterface;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LandingPageRepository;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LeadCaptureFormRepository;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductRepository;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductVariationRepository;
use Illuminate\Support\ServiceProvider;

class ProductsDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            LandingPageRepositoryInterface::class,
            LandingPageRepository::class,
        );

        $this->app->bind(
            LeadCaptureFormRepositoryInterface::class,
            LeadCaptureFormRepository::class,
        );

        $this->app->bind(
            ProductRepositoryInterface::class,
            ProductRepository::class,
        );

        $this->app->bind(
            ProductVariationRepositoryInterface::class,
            ProductVariationRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
