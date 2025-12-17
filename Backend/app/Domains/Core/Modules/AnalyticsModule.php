<?php

namespace App\Domains\Core\Modules;

use App\Domains\Core\Modules\BaseModule;

/**
 * Analytics Module
 * 
 * Module for analytics functionality.
 * Extends BaseModule to provide analytics-specific features.
 */
class AnalyticsModule extends BaseModule
{
    /**
     * Get the module name.
     * 
     * @return string
     */
    public function getName(): string
    {
        return 'analytics';
    }

    /**
     * Boot the analytics module.
     * 
     * @return void
     */
    public function boot(): void
    {
        parent::boot();
        
        // Module-specific boot logic can be added here
        // For example: register routes, bind services, etc.
    }
}
