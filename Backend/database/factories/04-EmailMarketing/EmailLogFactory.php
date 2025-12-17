<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailLogFactory extends Factory
{
    protected $model = EmailLog::class;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->faker->boolean(80) ? Campaign::factory() : null,
            'subscriber_id' => $this->faker->boolean(90) ? EmailSubscriber::factory() : null,
            'status' => $this->faker->randomElement(['sent', 'opened', 'clicked', 'failed', 'bounced']),
            'event_at' => $this->faker->dateTimeThisYear(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'details' => [],
        ];
    }

    public function sent(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
        ]);
    }

    public function opened(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'opened',
        ]);
    }

    public function clicked(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'clicked',
        ]);
    }

    public function failed(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
        ]);
    }

    public function bounced(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'bounced',
        ]);
    }
}
