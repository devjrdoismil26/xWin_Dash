<?php

namespace Database\Factories;

use App\Models\AnalyticsEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalyticsEventFactory extends Factory
{
    protected $model = AnalyticsEvent::class;

    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'event_name' => $this->faker->randomElement([
                'page_view', 'click', 'conversion', 'signup', 'purchase',
                'download', 'video_play', 'form_submit', 'search', 'logout',
            ]),
            'event_category' => $this->faker->randomElement(['user_action', 'system', 'marketing', 'engagement']),
            'event_label' => $this->faker->optional(0.7)->words(2, true),
            'event_value' => $this->faker->optional(0.4)->randomFloat(2, 0, 1000),
            'properties' => $this->faker->optional(0.8)->randomElements([
                'button_id' => $this->faker->word,
                'source' => $this->faker->randomElement(['organic', 'paid', 'direct', 'referral']),
                'device_type' => $this->faker->randomElement(['mobile', 'desktop', 'tablet']),
                'browser' => $this->faker->randomElement(['chrome', 'firefox', 'safari', 'edge']),
            ]),
            'session_id' => $this->faker->uuid(),
            'user_id_external' => $this->faker->optional(0.6)->uuid(),
            'device_id' => $this->faker->uuid(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'referrer' => $this->faker->optional(0.5)->url(),
            'utm_source' => $this->faker->optional(0.3)->word(),
            'utm_medium' => $this->faker->optional(0.3)->word(),
            'utm_campaign' => $this->faker->optional(0.3)->words(2, true),
            'utm_content' => $this->faker->optional(0.2)->word(),
            'utm_term' => $this->faker->optional(0.2)->word(),
            'page_url' => $this->faker->url(),
            'page_title' => $this->faker->sentence(4),
            'country' => $this->faker->countryCode(),
            'region' => $this->faker->state(),
            'city' => $this->faker->city(),
            'device_type' => $this->faker->randomElement(['mobile', 'desktop', 'tablet']),
            'browser' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
            'os' => $this->faker->randomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
            'occurred_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'project_id' => \App\Models\Project::factory(),
            'user_id' => $this->faker->optional(0.6)->randomElement([\App\Models\User::factory()]),
        ];
    }

    public function pageView(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_name' => 'page_view',
            'event_category' => 'user_action',
        ]);
    }

    public function conversion(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_name' => 'conversion',
            'event_category' => 'marketing',
            'event_value' => $this->faker->randomFloat(2, 10, 500),
        ]);
    }
}
