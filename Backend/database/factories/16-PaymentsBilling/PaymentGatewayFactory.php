<?php

namespace Database\Factories;

use App\Models\PaymentGateway;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentGatewayFactory extends Factory
{
    protected $model = PaymentGateway::class;

    public function definition(): array
    {
        $gateways = [
            'stripe' => [
                'name' => 'Stripe',
                'supported_methods' => ['credit_card', 'debit_card', 'pix', 'boleto'],
                'supported_currencies' => ['USD', 'EUR', 'BRL'],
                'supported_countries' => ['US', 'BR', 'EU'],
                'fee_percentage' => 2.9,
                'fee_fixed' => 0.30,
            ],
            'paypal' => [
                'name' => 'PayPal',
                'supported_methods' => ['paypal', 'credit_card'],
                'supported_currencies' => ['USD', 'EUR', 'BRL'],
                'supported_countries' => ['US', 'BR', 'EU'],
                'fee_percentage' => 3.4,
                'fee_fixed' => 0.30,
            ],
            'mercadopago' => [
                'name' => 'Mercado Pago',
                'supported_methods' => ['credit_card', 'debit_card', 'pix', 'boleto'],
                'supported_currencies' => ['BRL', 'ARS', 'MXN'],
                'supported_countries' => ['BR', 'AR', 'MX'],
                'fee_percentage' => 4.99,
                'fee_fixed' => 0.39,
            ],
        ];

        $gateway = $this->faker->randomElement(array_keys($gateways));
        $config = $gateways[$gateway];

        return [
            'id' => $this->faker->uuid(),
            'name' => $config['name'],
            'code' => $gateway,
            'description' => "Integration with {$config['name']} payment gateway",
            'logo' => "/images/gateways/{$gateway}.png",
            'supported_methods' => $config['supported_methods'],
            'supported_currencies' => $config['supported_currencies'],
            'supported_countries' => $config['supported_countries'],
            'credentials' => encrypt(json_encode([
                'api_key' => $this->faker->regexify('[A-Za-z0-9]{32}'),
                'secret_key' => $this->faker->regexify('[A-Za-z0-9]{64}'),
                'webhook_secret' => $this->faker->regexify('[A-Za-z0-9]{32}'),
            ])),
            'api_endpoint' => "https://api.{$gateway}.com",
            'webhook_endpoint' => "https://api.{$gateway}.com/webhooks",
            'transaction_fee_percentage' => $config['fee_percentage'],
            'transaction_fee_fixed' => $config['fee_fixed'],
            'is_active' => $this->faker->boolean(85),
            'is_sandbox' => $this->faker->boolean(30),
            'sort_order' => $this->faker->numberBetween(0, 10),
            'settings' => [
                'auto_capture' => $this->faker->boolean(),
                'require_cvv' => $this->faker->boolean(80),
                'require_address' => $this->faker->boolean(60),
                'timeout_seconds' => $this->faker->numberBetween(30, 300),
            ],
            'project_id' => \App\Models\Project::factory(),
        ];
    }

    public function stripe(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Stripe',
            'code' => 'stripe',
            'api_endpoint' => 'https://api.stripe.com',
        ]);
    }

    public function paypal(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'PayPal',
            'code' => 'paypal',
            'api_endpoint' => 'https://api.paypal.com',
        ]);
    }

    public function sandbox(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_sandbox' => true,
        ]);
    }

    public function production(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_sandbox' => false,
        ]);
    }
}
