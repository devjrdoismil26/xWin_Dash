<?php

namespace App\Providers\Validation\Business;

use Illuminate\Support\ServiceProvider;

/**
 * 💼 Validation Business Service Provider
 * 
 * Registra serviços de validação de regras de negócio
 */
class ValidationBusinessServiceProvider extends ServiceProvider
{
    /**
     * Indica se o provider deve ser carregado apenas quando necessário
     */
    protected $defer = true;

    /**
     * Lista de serviços fornecidos por este provider
     */
    public function provides(): array
    {
        return [
            \App\Services\Validation\Business\BusinessValidationService::class,
            \App\Services\Validation\Business\BusinessRuleEngine::class,
            \App\Services\Validation\Business\BusinessConstraintValidator::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para business validation service
        $this->app->bind(\App\Services\Validation\Business\BusinessValidationService::class, function ($app) {
            return new \App\Services\Validation\Business\BusinessValidationService();
        });

        // Binding para business rule engine
        $this->app->bind(\App\Services\Validation\Business\BusinessRuleEngine::class, function ($app) {
            return new \App\Services\Validation\Business\BusinessRuleEngine();
        });

        // Binding para business constraint validator
        $this->app->bind(\App\Services\Validation\Business\BusinessConstraintValidator::class, function ($app) {
            return new \App\Services\Validation\Business\BusinessConstraintValidator();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('validation.business.enabled', true)) {
            // Registrar listeners de eventos de negócio
            // Event::listen(BusinessValidationEvent::class, BusinessValidationListener::class);
        }
    }
}