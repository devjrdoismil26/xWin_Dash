<?php

namespace App\Domains\Core\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::class => \App\Domains\Projects\Policies\ProjectPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
        $this->registerPolicies();

        // Implicitly register policies for models that do not have a policy explicitly defined.
        // Gate::guessPolicyNamesUsing(function (string $modelClass) {
        //     return 'App\Policies\' . class_basename($modelClass) . 'Policy';
        // });
    }
}
