<?php

namespace App\Domains\Leads\Providers;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Contracts\LeadServiceInterface;
use App\Domains\Leads\Contracts\SegmentServiceInterface;
use App\Domains\Leads\Domain\LeadCustomFieldRepositoryInterface;
use App\Domains\Leads\Domain\LeadCustomValueRepositoryInterface;
use App\Domains\Leads\Domain\LeadEmailRepositoryInterface;
use App\Domains\Leads\Domain\LeadHistoryRepositoryInterface;
use App\Domains\Leads\Domain\SegmentRepositoryInterface;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadCustomFieldRepository;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadCustomValueRepository;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadEmailRepository;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadHistoryRepository;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadRepository;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\SegmentRepository;
use App\Domains\Leads\Services\LeadService;
use App\Domains\Leads\Services\SegmentationService;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class LeadsDomainServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(LeadRepositoryInterface::class, LeadRepository::class);
        $this->app->bind(LeadServiceInterface::class, LeadService::class);
        $this->app->bind(SegmentServiceInterface::class, SegmentationService::class);
        $this->app->bind(LeadCustomFieldRepositoryInterface::class, LeadCustomFieldRepository::class);
        $this->app->bind(LeadCustomValueRepositoryInterface::class, LeadCustomValueRepository::class);
        $this->app->bind(LeadEmailRepositoryInterface::class, LeadEmailRepository::class);
        $this->app->bind(LeadHistoryRepositoryInterface::class, LeadHistoryRepository::class);
        $this->app->bind(SegmentRepositoryInterface::class, SegmentRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
    }
}
