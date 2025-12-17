<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EmailLinkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmailLink::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'campaign_id' => EmailCampaign::factory(),
            'original_url' => $this->faker->url(),
            'tracking_url' => Str::random(10),
            'click_count' => $this->faker->numberBetween(0, 500),
        ];
    }

    /**
     * Indicate a specific click count.
     *
     * @param int $count
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withClickCount(int $count)
    {
        return $this->state(function (array $attributes) use ($count) {
            return [
                'click_count' => $count,
            ];
        });
    }
}
