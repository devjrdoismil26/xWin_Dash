<?php

namespace Database\Factories;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains$1\Domain$2
 */
class AuraConnectionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = AuraConnection::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'name' => fake()->words(2, true) . ' WhatsApp',
            'phone_number' => fake()->phoneNumber(),
            'status' => fake()->randomElement(['connected', 'disconnected', 'pending', 'error']),
            'qr_code' => fake()->optional()->url(),
            'session_data' => encrypt([
                'session_id' => fake()->uuid(),
                'client_info' => fake()->userAgent(),
                'last_activity' => fake()->dateTime(),
            ]),
            'project_id' => \App\Domains$1\Domain$2
            'user_id' => \App\Domains$1\Domain$2
            'webhook_url' => fake()->optional()->url(),
            'settings' => [
                'auto_reply' => fake()->boolean(),
                'business_hours' => fake()->randomElement(['24/7', '9-17', 'custom']),
                'max_messages_per_day' => fake()->numberBetween(100, 1000),
            ],
            'last_connected_at' => fake()->optional()->dateTimeBetween('-1 week', 'now'),
        ];
    }

}
