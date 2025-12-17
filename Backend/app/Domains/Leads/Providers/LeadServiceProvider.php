<?php

namespace App\Domains\Leads\Providers;

use App\Domains\Leads\Contracts\LeadRepositoryInterface as ContractsLeadRepositoryInterface;
use App\Domains\Leads\Domain\LeadRepositoryInterface as DomainLeadRepositoryInterface;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel as Lead;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadRepository as EloquentLeadRepository;
use App\Domains\Leads\Observers\LeadObserver;
use Illuminate\Support\ServiceProvider;

class LeadServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            DomainLeadRepositoryInterface::class,
            EloquentLeadRepository::class,
        );

        // Compatibilidade com Contracts legacy
        $this->app->bind(
            ContractsLeadRepositoryInterface::class,
            EloquentLeadRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Lead::observe(LeadObserver::class);
    }
}
