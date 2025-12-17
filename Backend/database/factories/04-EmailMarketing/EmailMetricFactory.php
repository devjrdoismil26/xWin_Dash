<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailMetricFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmailMetric::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'campaign_id' => EmailCampaign::factory(),
            'lead_id' => Lead::factory(),
            'event_type' => $this->faker->randomElement(['open', 'click', 'bounce', 'unsubscribe']),
            'event_data' => [],
            'user_agent' => $this->faker->userAgent(),
            'ip_address' => $this->faker->ipv4(),
        ];
    }

    /**
     * Indicate that the metric is an open event.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function open()
    {
        return $this->state(function (array $attributes) {
            return [
                'event_type' => 'open',
            ];
        });
    }

    /**
     * Indicate that the metric is a click event.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function click()
    {
        return $this->state(function (array $attributes) {
            return [
                'event_type' => 'click',
                'event_data' => ['url' => $this->faker->url()],
            ];
        });
    }

    /**
     * Indicate that the metric is a bounce event.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function bounce()
    {
        return $this->state(function (array $attributes) {
            return [
                'event_type' => 'bounce',
                'event_data' => ['type' => $this->faker->randomElement(['hard', 'soft']), 'code' => $this->faker->randomNumber(3)],
            ];
        });
    }

    /**
     * Indicate that the metric is an unsubscribe event.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unsubscribe()
    {
        return $this->state(function (array $attributes) {
            return [
                'event_type' => 'unsubscribe',
                'event_data' => ['reason' => $this->faker->sentence()],
            ];
        });
    }
}
