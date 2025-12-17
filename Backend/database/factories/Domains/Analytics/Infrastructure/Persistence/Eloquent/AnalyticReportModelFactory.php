<?php

namespace Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticReportModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticReportModelFactory extends Factory
{
    protected $model = AnalyticReportModel::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-3 months', '-1 month');
        $endDate = (clone $startDate)->modify('+1 month');

        return [
            'name' => $this->faker->randomElement([
                'Monthly Performance Report',
                'User Engagement Analysis',
                'Conversion Funnel Report',
                'Traffic Sources Summary',
                'Revenue Analytics Dashboard',
                'Customer Behavior Insights',
                'Marketing Campaign Results',
                'Product Usage Statistics',
                'Website Performance Metrics',
                'Social Media Analytics',
                'Email Marketing Report',
                'SEO Performance Analysis',
                'Mobile App Analytics',
                'E-commerce Sales Report',
                'Customer Retention Analysis'
            ]),
            'report_type' => $this->faker->randomElement(['performance', 'engagement', 'conversion', 'traffic', 'revenue', 'behavior', 'marketing', 'technical']),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $this->faker->randomElement(['pending', 'generating', 'completed', 'failed']),
            'generated_at' => $this->faker->optional(0.8)->dateTimeBetween($startDate, 'now'),
            'user_id' => $this->faker->optional(0.9)->uuid(),
            'data' => $this->faker->optional(0.7)->randomElements([
                'summary' => [
                    'total_sessions' => $this->faker->numberBetween(1000, 100000),
                    'total_users' => $this->faker->numberBetween(500, 50000),
                    'total_page_views' => $this->faker->numberBetween(5000, 500000),
                    'bounce_rate' => $this->faker->randomFloat(2, 20, 80),
                    'avg_session_duration' => $this->faker->numberBetween(60, 600),
                    'conversion_rate' => $this->faker->randomFloat(2, 1, 15),
                    'revenue' => $this->faker->randomFloat(2, 1000, 100000)
                ],
                'traffic_sources' => [
                    'organic' => $this->faker->numberBetween(30, 60),
                    'direct' => $this->faker->numberBetween(20, 40),
                    'social' => $this->faker->numberBetween(5, 25),
                    'paid' => $this->faker->numberBetween(10, 30),
                    'referral' => $this->faker->numberBetween(5, 20),
                    'email' => $this->faker->numberBetween(2, 15)
                ],
                'device_breakdown' => [
                    'desktop' => $this->faker->numberBetween(40, 70),
                    'mobile' => $this->faker->numberBetween(20, 50),
                    'tablet' => $this->faker->numberBetween(5, 20)
                ],
                'top_pages' => [
                    ['page' => '/', 'views' => $this->faker->numberBetween(1000, 10000)],
                    ['page' => '/products', 'views' => $this->faker->numberBetween(500, 5000)],
                    ['page' => '/about', 'views' => $this->faker->numberBetween(200, 2000)],
                    ['page' => '/contact', 'views' => $this->faker->numberBetween(100, 1000)]
                ],
                'conversion_funnel' => [
                    'visitors' => $this->faker->numberBetween(10000, 100000),
                    'leads' => $this->faker->numberBetween(1000, 10000),
                    'trials' => $this->faker->numberBetween(100, 1000),
                    'customers' => $this->faker->numberBetween(50, 500)
                ],
                'geographic_data' => [
                    'top_countries' => [
                        ['country' => 'United States', 'sessions' => $this->faker->numberBetween(1000, 10000)],
                        ['country' => 'Brazil', 'sessions' => $this->faker->numberBetween(500, 5000)],
                        ['country' => 'United Kingdom', 'sessions' => $this->faker->numberBetween(200, 2000)]
                    ]
                ],
                'performance_metrics' => [
                    'avg_page_load_time' => $this->faker->numberBetween(1, 5),
                    'first_contentful_paint' => $this->faker->numberBetween(0.5, 3),
                    'largest_contentful_paint' => $this->faker->numberBetween(1, 4),
                    'cumulative_layout_shift' => $this->faker->randomFloat(2, 0, 0.5)
                ]
            ], $this->faker->numberBetween(3, 6)),
            'properties' => $this->faker->optional(0.6)->randomElements([
                'report_category' => $this->faker->randomElement(['marketing', 'sales', 'product', 'technical', 'business']),
                'frequency' => $this->faker->randomElement(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
                'format' => $this->faker->randomElement(['pdf', 'excel', 'csv', 'json', 'dashboard']),
                'automated' => $this->faker->boolean(70),
                'schedule' => $this->faker->optional(0.6)->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
                'recipients' => $this->faker->optional(0.5)->randomElements([
                    'admin@example.com',
                    'marketing@example.com',
                    'sales@example.com'
                ], $this->faker->numberBetween(1, 3)),
                'filters_applied' => [
                    'date_range' => 'last_30_days',
                    'traffic_source' => 'all',
                    'device_type' => 'all',
                    'country' => 'all'
                ],
                'segments' => $this->faker->optional(0.4)->randomElements([
                    'new_users', 'returning_users', 'high_value_customers', 'mobile_users'
                ], $this->faker->numberBetween(1, 3)),
                'metrics_included' => $this->faker->randomElements([
                    'sessions', 'users', 'page_views', 'bounce_rate', 'conversion_rate', 'revenue'
                ], $this->faker->numberBetween(3, 6)),
                'comparison_period' => $this->faker->optional(0.5)->randomElement(['previous_period', 'same_period_last_year', 'baseline']),
                'confidence_level' => $this->faker->randomElement(['95%', '99%', '90%']),
                'data_quality' => $this->faker->randomElement(['high', 'medium', 'low']),
                'last_updated' => $this->faker->dateTimeBetween('-1 week', 'now')->format('Y-m-d H:i:s')
            ], $this->faker->numberBetween(2, 5))
        ];
    }

    public function performance(): static
    {
        return $this->state(fn (array $attributes) => [
            'report_type' => 'performance',
            'name' => $this->faker->randomElement(['Website Performance Report', 'Page Speed Analysis', 'Core Web Vitals Report']),
            'data' => array_merge($attributes['data'] ?? [], [
                'performance_metrics' => [
                    'avg_page_load_time' => $this->faker->numberBetween(1, 5),
                    'first_contentful_paint' => $this->faker->numberBetween(0.5, 3),
                    'largest_contentful_paint' => $this->faker->numberBetween(1, 4),
                    'cumulative_layout_shift' => $this->faker->randomFloat(2, 0, 0.5),
                    'first_input_delay' => $this->faker->numberBetween(10, 200),
                    'time_to_interactive' => $this->faker->numberBetween(1, 8)
                ]
            ])
        ]);
    }

    public function conversion(): static
    {
        return $this->state(fn (array $attributes) => [
            'report_type' => 'conversion',
            'name' => $this->faker->randomElement(['Conversion Funnel Report', 'Sales Performance Analysis', 'Lead Generation Report']),
            'data' => array_merge($attributes['data'] ?? [], [
                'conversion_funnel' => [
                    'visitors' => $this->faker->numberBetween(10000, 100000),
                    'leads' => $this->faker->numberBetween(1000, 10000),
                    'trials' => $this->faker->numberBetween(100, 1000),
                    'customers' => $this->faker->numberBetween(50, 500)
                ],
                'conversion_rates' => [
                    'visitor_to_lead' => $this->faker->randomFloat(2, 5, 25),
                    'lead_to_trial' => $this->faker->randomFloat(2, 10, 40),
                    'trial_to_customer' => $this->faker->randomFloat(2, 15, 50)
                ]
            ])
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'generated_at' => $this->faker->dateTimeBetween('-1 week', 'now')
        ]);
    }

    public function automated(): static
    {
        return $this->state(fn (array $attributes) => [
            'properties' => array_merge($attributes['properties'] ?? [], [
                'automated' => true,
                'schedule' => $this->faker->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
                'frequency' => $this->faker->randomElement(['weekly', 'monthly'])
            ])
        ]);
    }
}