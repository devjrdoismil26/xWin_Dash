<?php

namespace Database\Factories\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsEventModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticsEventModelFactory extends Factory
{
    protected $model = AnalyticsEventModel::class;

    public function definition(): array
    {
        return [
            'event_name' => $this->faker->randomElement([
                'page_view',
                'button_click',
                'form_submit',
                'download',
                'video_play',
                'video_pause',
                'scroll_depth',
                'time_on_page',
                'exit_intent',
                'conversion',
                'purchase',
                'signup',
                'login',
                'search',
                'filter',
                'share',
                'like',
                'comment',
                'subscribe',
                'unsubscribe'
            ]),
            'event_category' => $this->faker->randomElement(['user_action', 'system_event', 'conversion', 'engagement']),
            'user_id' => null,
            'session_id' => $this->faker->uuid(),
            'referrer' => $this->faker->optional(0.6)->url(),
            'user_agent' => $this->faker->userAgent(),
            'ip_address' => $this->faker->ipv4(),
            'project_id' => $this->faker->uuid(),
            'properties' => $this->faker->optional(0.8)->randomElements([
                'page_title' => $this->faker->sentence(3),
                'element_id' => $this->faker->randomElement(['btn-submit', 'nav-menu', 'hero-cta', 'footer-link']),
                'element_class' => $this->faker->randomElement(['btn-primary', 'nav-item', 'cta-button']),
                'scroll_depth' => $this->faker->numberBetween(0, 100),
                'time_on_page' => $this->faker->numberBetween(1, 300),
                'form_data' => [
                    'form_id' => $this->faker->randomElement(['contact-form', 'newsletter-signup', 'lead-form']),
                    'fields_completed' => $this->faker->numberBetween(1, 5),
                    'validation_errors' => $this->faker->optional(0.2)->numberBetween(0, 3)
                ],
                'video_data' => [
                    'video_id' => $this->faker->uuid(),
                    'duration' => $this->faker->numberBetween(30, 600),
                    'current_time' => $this->faker->numberBetween(0, 300),
                    'quality' => $this->faker->randomElement(['720p', '1080p', '4K'])
                ],
                'ecommerce' => [
                    'product_id' => $this->faker->uuid(),
                    'product_name' => $this->faker->words(2, true),
                    'category' => $this->faker->randomElement(['electronics', 'clothing', 'books', 'home']),
                    'price' => $this->faker->randomFloat(2, 10, 1000),
                    'quantity' => $this->faker->numberBetween(1, 5),
                    'currency' => 'USD'
                ],
                'search_data' => [
                    'query' => $this->faker->words(3, true),
                    'results_count' => $this->faker->numberBetween(0, 1000),
                    'filters_applied' => $this->faker->randomElements(['category', 'price', 'brand', 'rating'])
                ],
                'device_info' => [
                    'screen_resolution' => $this->faker->randomElement(['1920x1080', '1366x768', '375x667', '414x896']),
                    'viewport_size' => $this->faker->randomElement(['desktop', 'tablet', 'mobile']),
                    'color_depth' => $this->faker->randomElement([24, 32]),
                    'pixel_ratio' => $this->faker->randomFloat(1, 1, 3)
                ],
                'performance' => [
                    'load_time' => $this->faker->numberBetween(100, 5000),
                    'dom_ready_time' => $this->faker->numberBetween(50, 3000),
                    'first_paint' => $this->faker->numberBetween(100, 2000),
                    'first_contentful_paint' => $this->faker->numberBetween(200, 3000)
                ]
            ], $this->faker->numberBetween(1, 4)),
            'occurred_at' => $this->faker->dateTimeBetween('-30 days', 'now')
        ];
    }

    public function pageView(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_name' => 'page_view',
            'event_type' => 'user_action',
            'properties' => array_merge($attributes['properties'] ?? [], [
                'page_title' => $this->faker->sentence(3),
                'page_category' => $this->faker->randomElement(['home', 'product', 'blog', 'about', 'contact']),
                'page_type' => $this->faker->randomElement(['landing', 'content', 'ecommerce', 'blog'])
            ])
        ]);
    }

    public function conversion(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_name' => 'conversion',
            'event_type' => 'conversion',
            'properties' => array_merge($attributes['properties'] ?? [], [
                'conversion_type' => $this->faker->randomElement(['purchase', 'signup', 'download', 'contact']),
                'conversion_value' => $this->faker->randomFloat(2, 10, 1000),
                'funnel_step' => $this->faker->randomElement(['awareness', 'interest', 'consideration', 'purchase']),
                'campaign_id' => $this->faker->optional(0.6)->uuid()
            ])
        ]);
    }

    public function engagement(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_name' => $this->faker->randomElement(['button_click', 'scroll_depth', 'time_on_page', 'video_play']),
            'event_type' => 'engagement',
            'properties' => array_merge($attributes['properties'] ?? [], [
                'engagement_score' => $this->faker->numberBetween(1, 100),
                'interaction_duration' => $this->faker->numberBetween(1, 300),
                'engagement_type' => $this->faker->randomElement(['high', 'medium', 'low'])
            ])
        ]);
    }
}