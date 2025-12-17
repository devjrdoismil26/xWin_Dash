<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\UniversalConnector>
 */
class UniversalConnectorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Domains\Universe\Models\UniversalConnector::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['api', 'webhook', 'database', 'file', 'email', 'sms', 'slack', 'discord', 'telegram', 'whatsapp']),
            'configuration' => [
                'url' => $this->faker->url(),
                'token' => $this->faker->uuid(),
            ],
            'status' => $this->faker->randomElement(['active', 'inactive', 'error', 'testing']),
            'is_connected' => $this->faker->boolean(),
            'metadata' => [
                'created_by' => $this->faker->name(),
                'version' => $this->faker->semver(),
            ],
            'user_id' => User::factory(),
        ];
    }
}
