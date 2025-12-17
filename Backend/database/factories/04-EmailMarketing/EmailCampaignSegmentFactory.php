<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class CampaignSegmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CampaignSegment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'campaign_id' => Campaign::factory(),
            'name' => $this->faker->unique()->words(2, true) . ' Segment',
            'conditions' => [
                ['field' => 'city', 'operator' => 'equals', 'value' => $this->faker->city()],
                ['field' => 'age', 'operator' => 'greater_than', 'value' => $this->faker->numberBetween(18, 60)],
            ],
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterMaking(function (CampaignSegment $campaignSegment) {
            //
        })->afterCreating(function (CampaignSegment $campaignSegment) {
            //
        });
    }
}
