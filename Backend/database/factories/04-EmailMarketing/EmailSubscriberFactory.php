<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EmailSubscriberFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmailSubscriber::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'name' => $this->faker->name(),
            'status' => $this->faker->randomElement(['subscribed', 'unsubscribed', 'bounced']),
            'source' => $this->faker->randomElement(['form', 'import', 'api']),
            'ip_address' => $this->faker->ipv4(),
            'confirmation_token' => Str::random(32),
            'confirmed_at' => $this->faker->boolean(80) ? now() : null, // 80% chance of being confirmed
        ];
    }

    /**
     * Indicate that the subscriber is unconfirmed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unconfirmed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'confirmed_at' => null,
            ];
        });
    }

    /**
     * Indicate that the subscriber is unsubscribed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unsubscribed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'unsubscribed',
                'confirmed_at' => now(),
            ];
        });
    }
}
