<?php

namespace App\Providers;

use App\Domains\Core\Services\ModuleManager;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->singleton(ModuleManager::class, function ($app) {
            return new ModuleManager();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $moduleManager = $this->app->make(ModuleManager::class);

        // Auto-discover and register modules from Domains
        // Modules that implement the Module interface will be automatically registered
        $domainsPath = app_path('Domains');
        if (is_dir($domainsPath)) {
            $domains = array_filter(glob($domainsPath . '/*'), 'is_dir');
            foreach ($domains as $domain) {
                $domainName = basename($domain);
                // Try to find Module class in the domain
                $moduleClass = "App\\Domains\\{$domainName}\\Module";
                if (class_exists($moduleClass)) {
                    try {
                        $moduleManager->register(new $moduleClass());
                    } catch (\Exception $e) {
                        // Silently skip if module cannot be instantiated
                        \Log::debug("Could not register module {$domainName}: " . $e->getMessage());
                    }
                }
            }
        }

        // Boot all registered modules
        $moduleManager->boot();
    }
}
