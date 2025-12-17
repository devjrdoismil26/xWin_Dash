<?php

namespace App\Providers\Integrations\Payment;

use Illuminate\Support\ServiceProvider;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 💳 Payment Integration Service Provider
 * 
 * Registra serviços de integração com gateways de pagamento
 */
class PaymentIntegrationServiceProvider extends ServiceProvider
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
            // Stripe
            \App\Services\Payment\StripeService::class,
            // PayPal
            \App\Services\Payment\PayPalService::class,
            // PagSeguro
            \App\Services\Payment\PagSeguroService::class,
            // Mercado Pago
            \App\Services\Payment\MercadoPagoService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Stripe Service
        $this->app->bind(\App\Services\Payment\StripeService::class, function ($app) {
            return new \App\Services\Payment\StripeService(
                config('services.stripe.secret_key'),
                config('services.stripe.publishable_key'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // PayPal Service
        $this->app->bind(\App\Services\Payment\PayPalService::class, function ($app) {
            return new \App\Services\Payment\PayPalService(
                config('services.paypal.client_id'),
                config('services.paypal.client_secret'),
                config('services.paypal.sandbox'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // PagSeguro Service
        $this->app->bind(\App\Services\Payment\PagSeguroService::class, function ($app) {
            return new \App\Services\Payment\PagSeguroService(
                config('services.pagseguro.email'),
                config('services.pagseguro.token'),
                config('services.pagseguro.sandbox'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Mercado Pago Service
        $this->app->bind(\App\Services\Payment\MercadoPagoService::class, function ($app) {
            return new \App\Services\Payment\MercadoPagoService(
                config('services.mercadopago.access_token'),
                config('services.mercadopago.public_key'),
                config('services.mercadopago.sandbox'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('integrations.payment.enabled', true)) {
            // Registrar listeners de eventos específicos de pagamento
            // Event::listen(PaymentEvent::class, PaymentListener::class);
        }
    }
}