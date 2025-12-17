<?php

namespace App\Domains\Core\Modules;

use App\Domains\Core\Contracts\Module;

/**
 * Base Module Implementation
 * 
 * Provides a base implementation for modules that implement the Module interface.
 * This class can be extended by specific modules to provide default behavior.
 */
abstract class BaseModule implements Module
{
    /**
     * Get the module name.
     * 
     * @return string
     */
    abstract public function getName(): string;

    /**
     * Boot the module.
     * 
     * This method is called when the module is registered.
     * Override this method to perform module-specific initialization.
     * 
     * @return void
     */
    public function boot(): void
    {
        // Default implementation - can be overridden by child classes
    }
}
