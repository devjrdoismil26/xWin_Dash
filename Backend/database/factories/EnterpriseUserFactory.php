<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\EnterpriseUser>
 */
class EnterpriseUserFactory extends Factory
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
            'user_id' => \App\Models\User::factory(),
            'role' => $this->faker->randomElement(['admin', 'manager', 'member', 'viewer']),
            'permissions' => $this->faker->words(5),
            'profile_data' => [
                'department' => $this->faker->randomElement(['engineering', 'marketing', 'sales', 'support']),
                'job_title' => $this->faker->jobTitle(),
                'phone' => $this->faker->phoneNumber(),
            ],
            'status' => $this->faker->randomElement(['active', 'pending', 'suspended']),
            'last_login_at' => $this->faker->optional(0.8)->dateTimeBetween('-30 days', 'now'),
            'invited_at' => $this->faker->dateTimeBetween('-60 days', '-1 day'),
            'accepted_at' => $this->faker->optional(0.9)->dateTimeBetween('-60 days', 'now'),
            'metadata' => [
                'source' => $this->faker->randomElement(['invitation', 'import', 'signup']),
                'notes' => $this->faker->sentence(),
            ],
        ];
    }
}
