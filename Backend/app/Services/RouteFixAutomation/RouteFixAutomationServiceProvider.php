<?php

namespace App\Services\RouteFixAutomation;

use Illuminate\Support\ServiceProvider;
use App\Services\RouteFixAutomation\RouteFixAutomator;
use App\Services\RouteFixAutomation\Fixers\ServiceProviderFixer;
use App\Services\RouteFixAutomation\Fixers\RepositoryInterfaceFixer;
use App\Services\RouteFixAutomation\Fixers\ConfigurationProblemFixer;
use App\Services\RouteFixAutomation\Fixers\MissingServiceFixer;
use App\Services\RouteFixAutomation\Testing\ControllerTester;
use App\Services\RouteFixAutomation\Logging\ProgressTracker;

class RouteFixAutomationServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(ControllerTester::class);
        $this->app->singleton(ProgressTracker::class);
        $this->app->singleton(ServiceProviderFixer::class);
        $this->app->singleton(RepositoryInterfaceFixer::class);
        $this->app->singleton(ConfigurationProblemFixer::class);
        $this->app->singleton(MissingServiceFixer::class);
        $this->app->singleton(RouteFixAutomator::class);
    }

    public function boot()
    {
        //
    }
}