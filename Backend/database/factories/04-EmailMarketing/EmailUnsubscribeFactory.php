<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailUnsubscribeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmailUnsubscribe::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'lead_id' => Lead::factory(),
            'campaign_id' => Campaign::factory(),
            'reason' => $this->faker->randomElement(['not_interested', 'too_many_emails', 'spam', 'wrong_person', 'other']),
            'feedback' => $this->faker->boolean(50) ? $this->faker->sentence() : null,
        ];
    }

    /**
     * Indicate a specific reason for unsubscribe.
     *
     * @param string $reason
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withReason(string $reason)
    {
        return $this->state(function (array $attributes) use ($reason) {
            return [
                'reason' => $reason,
            ];
        });
    }
}
