<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\EnterpriseTenant>
 */
class EnterpriseTenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->paragraph(),
            'domain' => $this->faker->domainName(),
            'subdomain' => $this->faker->unique()->slug(),
            'plan_type' => $this->faker->randomElement(['starter', 'professional', 'enterprise']),
            'plan_configuration' => [
                'max_users' => $this->faker->numberBetween(10, 1000),
                'max_storage_gb' => $this->faker->numberBetween(10, 1000),
                'features' => $this->faker->words(5),
            ],
            'billing_info' => [
                'billing_email' => $this->faker->email(),
                'payment_method' => $this->faker->randomElement(['credit_card', 'bank_transfer', 'paypal']),
                'billing_cycle' => $this->faker->randomElement(['monthly', 'yearly']),
            ],
            'security_settings' => [
                'sso_enabled' => $this->faker->boolean(),
                'mfa_required' => $this->faker->boolean(),
                'password_policy' => $this->faker->randomElement(['basic', 'strong', 'enterprise']),
            ],
            'compliance_settings' => [
                'gdpr_compliant' => $this->faker->boolean(),
                'sox_compliant' => $this->faker->boolean(),
                'hipaa_compliant' => $this->faker->boolean(),
            ],
            'status' => $this->faker->randomElement(['active', 'suspended', 'trial']),
            'max_users' => $this->faker->numberBetween(10, 1000),
            'max_storage_gb' => $this->faker->numberBetween(10, 1000),
            'features_enabled' => $this->faker->words(8),
            'metadata' => [
                'industry' => $this->faker->randomElement(['technology', 'healthcare', 'finance', 'education']),
                'company_size' => $this->faker->randomElement(['startup', 'small', 'medium', 'enterprise']),
            ],
            'owner_id' => \App\Models\User::factory(),
        ];
    }
}
