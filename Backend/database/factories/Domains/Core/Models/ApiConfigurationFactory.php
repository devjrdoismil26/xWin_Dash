<?php

namespace Database\Factories\Domains\Core\Models;

use App\Domains\Core\Models\ApiConfiguration;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApiConfigurationFactory extends Factory
{
    protected $model = ApiConfiguration::class;

    public function definition(): array
    {
        $services = [
            'stripe',
            'paypal',
            'mailchimp',
            'sendgrid',
            'twilio',
            'aws',
            'google_analytics',
            'facebook_ads',
            'twitter_api',
            'linkedin_api',
            'github_api',
            'slack_api',
            'discord_api',
            'telegram_api',
            'whatsapp_api',
            'shopify_api',
            'woocommerce_api',
            'magento_api',
            'salesforce_api',
            'hubspot_api',
            'zapier_api',
            'webhook_api',
            'rest_api',
            'graphql_api'
        ];

        $serviceName = $this->faker->randomElement($services);

        return [
            'service_name' => $serviceName,
            'api_key' => $this->generateApiKey($serviceName),
            'is_active' => $this->faker->boolean(80),
            'settings' => $this->generateServiceSettings($serviceName),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function stripe(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_name' => 'stripe',
            'api_key' => 'sk_test_' . $this->faker->regexify('[a-zA-Z0-9]{24}'),
            'settings' => [
                'webhook_secret' => 'whsec_' . $this->faker->regexify('[a-zA-Z0-9]{32}'),
                'publishable_key' => 'pk_test_' . $this->faker->regexify('[a-zA-Z0-9]{24}'),
                'currency' => $this->faker->randomElement(['USD', 'EUR', 'BRL', 'GBP']),
                'test_mode' => true,
                'webhook_endpoint' => $this->faker->url() . '/webhooks/stripe',
                'supported_payment_methods' => ['card', 'bank_transfer', 'wallet'],
                'auto_capture' => true,
                'statement_descriptor' => $this->faker->company(),
                'metadata' => [
                    'environment' => 'test',
                    'version' => '2020-08-27',
                    'created_by' => 'system'
                ]
            ]
        ]);
    }

    public function mailchimp(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_name' => 'mailchimp',
            'api_key' => $this->faker->regexify('[a-zA-Z0-9]{32}-us[0-9]{1,2}'),
            'settings' => [
                'server_prefix' => 'us' . $this->faker->numberBetween(1, 20),
                'default_list_id' => $this->faker->regexify('[a-zA-Z0-9]{10}'),
                'webhook_secret' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
                'batch_size' => $this->faker->numberBetween(100, 1000),
                'timeout' => $this->faker->numberBetween(30, 300),
                'retry_attempts' => $this->faker->numberBetween(1, 5),
                'tags' => $this->faker->words(3),
                'segments' => [
                    'active_subscribers',
                    'inactive_subscribers',
                    'new_subscribers'
                ],
                'automation_workflows' => [
                    'welcome_series',
                    'abandoned_cart',
                    'birthday_campaign'
                ]
            ]
        ]);
    }

    public function twilio(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_name' => 'twilio',
            'api_key' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'settings' => [
                'account_sid' => 'AC' . $this->faker->regexify('[a-zA-Z0-9]{32}'),
                'auth_token' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
                'phone_number' => '+' . $this->faker->numberBetween(1000000000, 9999999999),
                'webhook_url' => $this->faker->url() . '/webhooks/twilio',
                'region' => $this->faker->randomElement(['us1', 'us2', 'eu1', 'au1']),
                'messaging_service_sid' => 'MG' . $this->faker->regexify('[a-zA-Z0-9]{32}'),
                'voice_url' => $this->faker->url() . '/voice',
                'status_callback' => $this->faker->url() . '/status',
                'max_price' => $this->faker->randomFloat(2, 0.01, 1.00),
                'validity_period' => $this->faker->numberBetween(60, 1440),
                'smart_encoded' => true,
                'persistent_action' => $this->faker->words(2),
                'shorten_urls' => true
            ]
        ]);
    }

    private function generateApiKey(string $serviceName): string
    {
        $patterns = [
            'stripe' => 'sk_test_' . $this->faker->regexify('[a-zA-Z0-9]{24}'),
            'paypal' => $this->faker->regexify('[a-zA-Z0-9]{80}'),
            'mailchimp' => $this->faker->regexify('[a-zA-Z0-9]{32}-us[0-9]{1,2}'),
            'sendgrid' => 'SG.' . $this->faker->regexify('[a-zA-Z0-9]{22}') . '.' . $this->faker->regexify('[a-zA-Z0-9]{43}'),
            'twilio' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'aws' => 'AKIA' . $this->faker->regexify('[A-Z0-9]{16}'),
            'google_analytics' => $this->faker->regexify('[a-zA-Z0-9]{24}'),
            'facebook_ads' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'twitter_api' => $this->faker->regexify('[a-zA-Z0-9]{25}'),
            'linkedin_api' => $this->faker->regexify('[a-zA-Z0-9]{16}'),
            'github_api' => 'ghp_' . $this->faker->regexify('[a-zA-Z0-9]{36}'),
            'slack_api' => 'xoxb-' . $this->faker->regexify('[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}'),
            'discord_api' => $this->faker->regexify('[a-zA-Z0-9]{24}'),
            'telegram_api' => $this->faker->numberBetween(100000000, 999999999) . ':' . $this->faker->regexify('[a-zA-Z0-9]{35}'),
            'whatsapp_api' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'shopify_api' => 'shpat_' . $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'woocommerce_api' => 'ck_' . $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'magento_api' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'salesforce_api' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'hubspot_api' => 'pat-' . $this->faker->regexify('[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}'),
            'zapier_api' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'webhook_api' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'rest_api' => $this->faker->regexify('[a-zA-Z0-9]{32}'),
            'graphql_api' => $this->faker->regexify('[a-zA-Z0-9]{32}')
        ];

        return $patterns[$serviceName] ?? $this->faker->regexify('[a-zA-Z0-9]{32}');
    }

    private function generateServiceSettings(string $serviceName): array
    {
        $baseSettings = [
            'webhook_url' => $this->faker->url() . '/webhooks/' . $serviceName,
            'timeout' => $this->faker->numberBetween(30, 300),
            'retry_attempts' => $this->faker->numberBetween(1, 5),
            'rate_limit' => $this->faker->numberBetween(100, 10000),
            'environment' => $this->faker->randomElement(['development', 'staging', 'production']),
            'version' => $this->faker->randomElement(['v1', 'v2', 'v3']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d H:i:s'),
            'metadata' => [
                'source' => 'factory',
                'test_data' => true,
                'tags' => $this->faker->words(3)
            ]
        ];

        $serviceSpecificSettings = [
            'stripe' => [
                'currency' => $this->faker->randomElement(['USD', 'EUR', 'BRL', 'GBP']),
                'test_mode' => true,
                'auto_capture' => true
            ],
            'mailchimp' => [
                'server_prefix' => 'us' . $this->faker->numberBetween(1, 20),
                'default_list_id' => $this->faker->regexify('[a-zA-Z0-9]{10}'),
                'batch_size' => $this->faker->numberBetween(100, 1000)
            ],
            'twilio' => [
                'phone_number' => '+' . $this->faker->numberBetween(1000000000, 9999999999),
                'region' => $this->faker->randomElement(['us1', 'us2', 'eu1', 'au1']),
                'max_price' => $this->faker->randomFloat(2, 0.01, 1.00)
            ],
            'aws' => [
                'region' => $this->faker->randomElement(['us-east-1', 'us-west-2', 'eu-west-1']),
                'bucket_name' => $this->faker->word() . '-bucket',
                'access_level' => $this->faker->randomElement(['read', 'write', 'admin'])
            ]
        ];

        return array_merge($baseSettings, $serviceSpecificSettings[$serviceName] ?? []);
    }
}