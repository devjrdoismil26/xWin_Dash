<?php

namespace Database\Factories;

use App\Domains\Analytics\Models\AnalyticReport;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticReportFactory extends Factory
{
    protected $model = AnalyticReport::class;

    public function definition(): array
    {
        return [
            'name' => fake()->sentence(4),
            'type' => fake()->randomElement(['leads', 'campaigns', 'social', 'revenue', 'traffic']),
            'period' => fake()->randomElement(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
            'start_date' => fake()->dateTimeBetween('-90 days', '-30 days'),
            'end_date' => fake()->dateTimeBetween('-29 days', 'now'),
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'data' => [
                'metrics' => [
                    'total' => fake()->numberBetween(100, 10000),
                    'growth' => fake()->randomFloat(2, -50, 100),
                    'conversion_rate' => fake()->randomFloat(2, 0, 100),
                ],
                'charts' => [
                    'line' => array_map(fn() => fake()->numberBetween(10, 1000), range(1, 30)),
                ],
            ],
            'status' => fake()->randomElement(['draft', 'published', 'archived']),
            'is_scheduled' => fake()->boolean(30),
            'schedule_config' => null,
        ];
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_scheduled' => true,
            'schedule_config' => [
                'frequency' => 'weekly',
                'day' => 'monday',
                'time' => '09:00',
                'recipients' => [fake()->email()],
            ],
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }
}
