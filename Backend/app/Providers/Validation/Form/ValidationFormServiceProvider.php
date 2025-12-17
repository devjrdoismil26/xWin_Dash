<?php

namespace App\Providers\Validation\Form;

use Illuminate\Support\ServiceProvider;

/**
 * 📝 Validation Form Service Provider
 * 
 * Registra serviços de validação de formulários
 */
class ValidationFormServiceProvider extends ServiceProvider
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
            \App\Services\Validation\Form\FormValidationService::class,
            \App\Services\Validation\Form\FormSanitizer::class,
            \App\Services\Validation\Form\FormValidator::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para form validation service
        $this->app->bind(\App\Services\Validation\Form\FormValidationService::class, function ($app) {
            return new \App\Services\Validation\Form\FormValidationService();
        });

        // Binding para form sanitizer
        $this->app->bind(\App\Services\Validation\Form\FormSanitizer::class, function ($app) {
            return new \App\Services\Validation\Form\FormSanitizer();
        });

        // Binding para form validator
        $this->app->bind(\App\Services\Validation\Form\FormValidator::class, function ($app) {
            return new \App\Services\Validation\Form\FormValidator();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('validation.form.enabled', true)) {
            // Registrar listeners de eventos de formulário
            // Event::listen(FormValidationEvent::class, FormValidationListener::class);
        }
    }
}