<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailBounceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmailBounce::class;

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
            'type' => $this->faker->randomElement(['hard', 'soft']),
            'code' => $this->faker->randomNumber(3),
            'description' => $this->faker->sentence(),
            'raw_data' => [],
        ];
    }

    /**
     * Indicate that the bounce is a hard bounce.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function hardBounce()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'hard',
            ];
        });
    }

    /**
     * Indicate that the bounce is a soft bounce.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function softBounce()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'soft',
            ];
        });
    }
}
