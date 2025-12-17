<?php

namespace Database\Factories\Aura;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraChatFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AuraChat::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'aura_connection_id' => AuraConnection::factory(),
            'lead_id' => Lead::factory(),
            'contact_whatsapp_id' => $this->faker->unique()->e164PhoneNumber(),
            'contact_name' => $this->faker->name(),
            'status' => $this->faker->randomElement(['open', 'closed', 'pending']),
            'assigned_to_user_id' => User::factory(),
            'last_message_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'unread_count' => $this->faker->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the chat is closed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function closed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'closed',
                'unread_count' => 0,
            ];
        });
    }
}
