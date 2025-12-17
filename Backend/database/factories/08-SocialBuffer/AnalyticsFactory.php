<?php

namespace Database\Factories\SocialBuffer;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticsFactory extends Factory
{
    protected $model = Analytics::class;

    public function definition(): array
    {
        return [
            'post_id' => $this->faker->boolean(70) ? Post::factory() : null,
            'schedule_id' => $this->faker->boolean(70) ? Schedule::factory() : null,
            'platform' => $this->faker->randomElement(['facebook', 'instagram', 'twitter']),
            'metric_type' => $this->faker->randomElement(['impressions', 'reach', 'engagement', 'clicks']),
            'metric_value' => $this->faker->randomFloat(2, 0, 100000),
            'metric_date' => $this->faker->date(),
            'additional_data' => [],
            'collected_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
