<?php

namespace Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsGoalModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticsGoalModelFactory extends Factory
{
    protected $model = AnalyticsGoalModel::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'Monthly Revenue Target',
                'User Registration Goal',
                'Email Signup Target',
                'Product Sales Goal',
                'Page Views Target',
                'Conversion Rate Goal',
                'Customer Retention Goal',
                'Social Media Engagement',
                'Content Downloads',
                'Support Ticket Resolution',
                'Feature Adoption Rate',
                'Customer Satisfaction Score',
                'Lead Generation Target',
                'Website Traffic Goal',
                'Mobile App Downloads'
            ]),
            'description' => $this->faker->sentence(),
            'goal_type' => $this->faker->randomElement(['revenue', 'conversion', 'engagement', 'retention', 'acquisition', 'performance']),
            'target_value' => $this->faker->randomFloat(2, 100, 100000),
            'current_value' => $this->faker->randomFloat(2, 0, 50000),
            'status' => $this->faker->randomElement(['active', 'completed', 'paused', 'cancelled']),
            'start_date' => $this->faker->dateTimeBetween('-6 months', '-1 month'),
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+6 months'),
            'user_id' => $this->faker->optional(0.8)->uuid(),
            'properties' => $this->faker->optional(0.6)->randomElements([
                'category' => $this->faker->randomElement(['marketing', 'sales', 'product', 'support', 'growth']),
                'priority' => $this->faker->randomElement(['high', 'medium', 'low']),
                'department' => $this->faker->randomElement(['marketing', 'sales', 'product', 'engineering', 'support']),
                'kpi_type' => $this->faker->randomElement(['absolute', 'percentage', 'ratio', 'count']),
                'measurement_frequency' => $this->faker->randomElement(['daily', 'weekly', 'monthly', 'quarterly']),
                'baseline_value' => $this->faker->randomFloat(2, 0, 10000),
                'growth_rate' => $this->faker->randomFloat(2, 0, 50),
                'milestones' => [
                    '25%' => $this->faker->randomFloat(2, 25, 25000),
                    '50%' => $this->faker->randomFloat(2, 50, 50000),
                    '75%' => $this->faker->randomFloat(2, 75, 75000),
                    '100%' => $this->faker->randomFloat(2, 100, 100000)
                ],
                'alert_thresholds' => [
                    'warning' => $this->faker->randomFloat(2, 70, 90),
                    'critical' => $this->faker->randomFloat(2, 50, 70)
                ],
                'related_goals' => $this->faker->randomElements([
                    'goal-1', 'goal-2', 'goal-3', 'goal-4'
                ], $this->faker->numberBetween(0, 3)),
                'tags' => $this->faker->words(3),
                'notes' => $this->faker->optional(0.3)->paragraph()
            ], $this->faker->numberBetween(1, 5))
        ];
    }

    public function revenue(): static
    {
        return $this->state(fn (array $attributes) => [
            'goal_type' => 'revenue',
            'name' => $this->faker->randomElement(['Monthly Revenue Target', 'Quarterly Sales Goal', 'Annual Revenue Target']),
            'target_value' => $this->faker->randomFloat(2, 10000, 1000000),
            'current_value' => $this->faker->randomFloat(2, 0, 500000),
            'properties' => array_merge($attributes['properties'] ?? [], [
                'currency' => 'USD',
                'revenue_type' => $this->faker->randomElement(['recurring', 'one-time', 'subscription', 'product']),
                'sales_channel' => $this->faker->randomElement(['online', 'retail', 'wholesale', 'direct'])
            ])
        ]);
    }

    public function conversion(): static
    {
        return $this->state(fn (array $attributes) => [
            'goal_type' => 'conversion',
            'name' => $this->faker->randomElement(['User Registration Goal', 'Email Signup Target', 'Product Purchase Goal']),
            'target_value' => $this->faker->randomFloat(2, 100, 10000),
            'current_value' => $this->faker->randomFloat(2, 0, 5000),
            'properties' => array_merge($attributes['properties'] ?? [], [
                'conversion_type' => $this->faker->randomElement(['signup', 'purchase', 'download', 'contact']),
                'funnel_stage' => $this->faker->randomElement(['awareness', 'interest', 'consideration', 'purchase']),
                'conversion_rate' => $this->faker->randomFloat(2, 1, 20)
            ])
        ]);
    }

    public function engagement(): static
    {
        return $this->state(fn (array $attributes) => [
            'goal_type' => 'engagement',
            'name' => $this->faker->randomElement(['Page Views Target', 'Social Media Engagement', 'Content Downloads']),
            'target_value' => $this->faker->randomFloat(2, 1000, 100000),
            'current_value' => $this->faker->randomFloat(2, 0, 50000),
            'properties' => array_merge($attributes['properties'] ?? [], [
                'engagement_type' => $this->faker->randomElement(['page_views', 'time_on_site', 'bounce_rate', 'social_shares']),
                'engagement_metric' => $this->faker->randomElement(['views', 'clicks', 'shares', 'comments', 'likes']),
                'target_audience' => $this->faker->randomElement(['all_users', 'registered_users', 'premium_users'])
            ])
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'current_value' => $this->faker->randomFloat(2, $attributes['target_value'] ?? 100, ($attributes['target_value'] ?? 100) * 1.2)
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'current_value' => $this->faker->randomFloat(2, 0, ($attributes['target_value'] ?? 100) * 0.8)
        ]);
    }
}