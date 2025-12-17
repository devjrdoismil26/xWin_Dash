<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\EnterpriseProject>
 */
class EnterpriseProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_id' => \App\Domains\Universe\Models\EnterpriseTenant::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'archived', 'planning']),
            'configuration' => [
                'visibility' => $this->faker->randomElement(['public', 'private', 'restricted']),
                'collaboration' => $this->faker->randomElement(['enabled', 'disabled']),
                'notifications' => $this->faker->boolean(),
            ],
            'security_settings' => [
                'access_control' => $this->faker->randomElement(['strict', 'moderate', 'relaxed']),
                'data_encryption' => $this->faker->boolean(),
                'audit_logging' => $this->faker->boolean(),
            ],
            'compliance_settings' => [
                'gdpr_compliant' => $this->faker->boolean(),
                'data_retention_days' => $this->faker->numberBetween(30, 3650),
                'backup_frequency' => $this->faker->randomElement(['daily', 'weekly', 'monthly']),
            ],
            'metadata' => [
                'industry' => $this->faker->randomElement(['technology', 'healthcare', 'finance', 'education']),
                'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'critical']),
                'budget' => $this->faker->randomFloat(2, 1000, 100000),
            ],
        ];
    }
}
