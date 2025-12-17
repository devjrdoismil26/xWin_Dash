<?php

namespace Database\Factories\Aura;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraMessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AuraMessage::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'aura_chat_id' => AuraChat::factory(),
            'message_provider_id' => $this->faker->uuid(),
            'direction' => $this->faker->randomElement(['inbound', 'outbound']),
            'type' => $this->faker->randomElement(['text', 'image', 'audio', 'video', 'document']),
            'content' => ['text' => $this->faker->sentence()],
            'status' => $this->faker->randomElement(['sent', 'delivered', 'read', 'failed']),
            'sent_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'delivered_at' => $this->faker->boolean(80) ? now() : null,
            'read_at' => $this->faker->boolean(50) ? now() : null,
            'error_message' => $this->faker->boolean(10) ? $this->faker->sentence() : null,
        ];
    }

    /**
     * Indicate that the message is inbound.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inbound()
    {
        return $this->state(function (array $attributes) {
            return [
                'direction' => 'inbound',
            ];
        });
    }

    /**
     * Indicate that the message is outbound.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function outbound()
    {
        return $this->state(function (array $attributes) {
            return [
                'direction' => 'outbound',
            ];
        });
    }
}
