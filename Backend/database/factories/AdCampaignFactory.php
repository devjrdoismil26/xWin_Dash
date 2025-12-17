<?php

namespace Database\Factories;

use App\Domains\ADStool\Models\AdCampaign;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdCampaignFactory extends Factory
{
    protected $model = AdCampaign::class;

    public function definition(): array
    {
        return [
            'name' => fake()->sentence(4),
            'platform' => fake()->randomElement(['google', 'facebook', 'instagram', 'linkedin']),
            'campaign_id' => fake()->uuid(),
            'status' => fake()->randomElement(['draft', 'active', 'paused', 'completed', 'cancelled']),
            'objective' => fake()->randomElement(['awareness', 'traffic', 'engagement', 'leads', 'conversions']),
            'budget' => fake()->randomFloat(2, 100, 10000),
            'daily_budget' => fake()->randomFloat(2, 10, 500),
            'spent' => fake()->randomFloat(2, 0, 5000),
            'start_date' => fake()->dateTimeBetween('-30 days', 'now'),
            'end_date' => fake()->optional()->dateTimeBetween('now', '+60 days'),
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'metrics' => [
                'impressions' => fake()->numberBetween(1000, 100000),
                'clicks' => fake()->numberBetween(50, 5000),
                'conversions' => fake()->numberBetween(5, 500),
                'ctr' => fake()->randomFloat(2, 0.5, 10),
                'cpc' => fake()->randomFloat(2, 0.1, 5),
                'cpa' => fake()->randomFloat(2, 1, 50),
            ],
            'targeting' => [
                'locations' => ['Brazil', 'São Paulo'],
                'age_range' => ['25-34', '35-44'],
                'interests' => fake()->words(5),
            ],
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_date' => fake()->dateTimeBetween('-7 days', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+30 days'),
        ]);
    }

    public function google(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'google',
        ]);
    }

    public function facebook(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'facebook',
        ]);
    }
}
