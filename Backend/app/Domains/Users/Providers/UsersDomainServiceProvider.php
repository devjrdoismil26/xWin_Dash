<?php

namespace App\Domains\Users\Providers;

use App\Domains\Users\Contracts\UserRepositoryInterface as UserRepositoryContract;
use App\Domains\Users\Domain\RoleRepositoryInterface;
use App\Domains\Users\Domain\UserPreferenceRepositoryInterface;
use App\Domains\Users\Domain\UserRepositoryInterface;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\RoleRepository;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserPreferenceRepository;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class UsersDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            RoleRepositoryInterface::class,
            RoleRepository::class,
        );

        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class,
        );

        $this->app->bind(
            UserRepositoryContract::class,
            UserRepository::class,
        );

        // Bind adicional para resolver conflitos de namespace
        $this->app->bind(
            'App\Domains\Users\Contracts\UserRepositoryInterface',
            UserRepository::class,
        );

        $this->app->bind(
            UserPreferenceRepositoryInterface::class,
            UserPreferenceRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
