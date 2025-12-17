<?php

namespace Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsSessionModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticsSessionModelFactory extends Factory
{
    protected $model = AnalyticsSessionModel::class;

    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('-30 days', 'now');
        $duration = $this->faker->numberBetween(30, 3600); // 30 seconds to 1 hour
        $endTime = (clone $startTime)->modify("+{$duration} seconds");

        return [
            'session_id' => $this->faker->uuid(),
            'user_id' => $this->faker->optional(0.6)->uuid(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration,
            'page_views' => $this->faker->numberBetween(1, 50),
            'bounce_rate' => $this->faker->randomFloat(2, 0, 100),
            'device_type' => $this->faker->randomElement(['desktop', 'mobile', 'tablet']),
            'browser' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera']),
            'os' => $this->faker->randomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'referrer' => $this->faker->optional(0.7)->randomElement([
                'https://google.com',
                'https://facebook.com',
                'https://twitter.com',
                'https://linkedin.com',
                'https://youtube.com',
                'direct',
                null
            ]),
            'properties' => $this->faker->optional(0.8)->randomElements([
                'screen_resolution' => $this->faker->randomElement(['1920x1080', '1366x768', '375x667', '414x896']),
                'viewport_size' => $this->faker->randomElement(['desktop', 'tablet', 'mobile']),
                'color_depth' => $this->faker->randomElement([24, 32]),
                'pixel_ratio' => $this->faker->randomFloat(1, 1, 3),
                'language' => $this->faker->randomElement(['en-US', 'pt-BR', 'es-ES', 'fr-FR', 'de-DE']),
                'timezone' => $this->faker->timezone(),
                'connection_type' => $this->faker->randomElement(['wifi', '4g', '3g', 'ethernet']),
                'connection_speed' => $this->faker->randomElement(['slow', 'medium', 'fast']),
                'is_bot' => false,
                'is_mobile_app' => $this->faker->boolean(20),
                'app_version' => $this->faker->optional(0.2)->semver(),
                'session_quality' => $this->faker->randomElement(['high', 'medium', 'low']),
                'engagement_score' => $this->faker->numberBetween(1, 100),
                'conversion_events' => $this->faker->numberBetween(0, 5),
                'exit_page' => $this->faker->url(),
                'entry_page' => $this->faker->url(),
                'traffic_source' => $this->faker->randomElement(['organic', 'paid', 'social', 'direct', 'referral', 'email']),
                'campaign_id' => $this->faker->optional(0.3)->uuid(),
                'campaign_name' => $this->faker->optional(0.3)->words(2, true),
                'ad_group' => $this->faker->optional(0.2)->words(2, true),
                'keyword' => $this->faker->optional(0.4)->words(2, true),
                'landing_page' => $this->faker->url(),
                'user_segment' => $this->faker->randomElement(['new_visitor', 'returning_visitor', 'high_value', 'at_risk']),
                'user_type' => $this->faker->randomElement(['anonymous', 'registered', 'premium', 'enterprise']),
                'session_events' => [
                    'page_views' => $this->faker->numberBetween(1, 20),
                    'clicks' => $this->faker->numberBetween(0, 50),
                    'scrolls' => $this->faker->numberBetween(0, 100),
                    'form_submissions' => $this->faker->numberBetween(0, 3),
                    'downloads' => $this->faker->numberBetween(0, 5),
                    'video_plays' => $this->faker->numberBetween(0, 3),
                    'social_shares' => $this->faker->numberBetween(0, 2)
                ],
                'performance_metrics' => [
                    'avg_page_load_time' => $this->faker->numberBetween(500, 5000),
                    'avg_time_on_page' => $this->faker->numberBetween(10, 300),
                    'pages_per_session' => $this->faker->randomFloat(1, 1, 10),
                    'session_depth' => $this->faker->numberBetween(1, 20)
                ],
                'conversion_data' => [
                    'converted' => $this->faker->boolean(15),
                    'conversion_type' => $this->faker->optional(0.15)->randomElement(['purchase', 'signup', 'download', 'contact']),
                    'conversion_value' => $this->faker->optional(0.15)->randomFloat(2, 10, 1000),
                    'conversion_time' => $this->faker->optional(0.15)->numberBetween(30, 1800)
                ]
            ], $this->faker->numberBetween(3, 8))
        ];
    }

    public function desktop(): static
    {
        return $this->state(fn (array $attributes) => [
            'device_type' => 'desktop',
            'browser' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
            'os' => $this->faker->randomElement(['Windows', 'macOS', 'Linux']),
            'properties' => array_merge($attributes['properties'] ?? [], [
                'screen_resolution' => $this->faker->randomElement(['1920x1080', '1366x768', '2560x1440', '3840x2160']),
                'viewport_size' => 'desktop'
            ])
        ]);
    }

    public function mobile(): static
    {
        return $this->state(fn (array $attributes) => [
            'device_type' => 'mobile',
            'browser' => $this->faker->randomElement(['Chrome Mobile', 'Safari Mobile', 'Samsung Internet']),
            'os' => $this->faker->randomElement(['iOS', 'Android']),
            'properties' => array_merge($attributes['properties'] ?? [], [
                'screen_resolution' => $this->faker->randomElement(['375x667', '414x896', '360x640', '390x844']),
                'viewport_size' => 'mobile'
            ])
        ]);
    }

    public function highEngagement(): static
    {
        return $this->state(fn (array $attributes) => [
            'page_views' => $this->faker->numberBetween(10, 50),
            'duration' => $this->faker->numberBetween(600, 3600),
            'bounce_rate' => $this->faker->randomFloat(2, 0, 30),
            'properties' => array_merge($attributes['properties'] ?? [], [
                'session_quality' => 'high',
                'engagement_score' => $this->faker->numberBetween(70, 100),
                'conversion_events' => $this->faker->numberBetween(1, 5)
            ])
        ]);
    }

    public function converted(): static
    {
        return $this->state(fn (array $attributes) => [
            'properties' => array_merge($attributes['properties'] ?? [], [
                'conversion_data' => [
                    'converted' => true,
                    'conversion_type' => $this->faker->randomElement(['purchase', 'signup', 'download', 'contact']),
                    'conversion_value' => $this->faker->randomFloat(2, 10, 1000),
                    'conversion_time' => $this->faker->numberBetween(30, 1800)
                ]
            ])
        ]);
    }
}