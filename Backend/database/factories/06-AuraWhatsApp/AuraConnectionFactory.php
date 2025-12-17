<?php

namespace Database\Factories\Aura;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraConnectionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AuraConnection::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'project_id' => Project::factory(),
            'name' => $this->faker->unique()->words(2, true) . ' Connection',
            'phone_number' => $this->faker->unique()->phoneNumber(),
            'provider' => $this->faker->randomElement(['whatsapp_cloud', 'twilio', 'z-api']),
            'api_key' => $this->faker->uuid(),
            'webhook_url' => $this->faker->url(),
            'status' => $this->faker->randomElement(['connected', 'disconnected', 'error']),
            'last_connected_at' => $this->faker->boolean(80) ? now() : null,
        ];
    }

    /**
     * Indicate that the connection is connected.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function connected()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'connected',
                'last_connected_at' => now(),
            ];
        });
    }

    /**
     * Indicate that the connection is disconnected.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function disconnected()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'disconnected',
                'last_connected_at' => null,
            ];
        });
    }
}
