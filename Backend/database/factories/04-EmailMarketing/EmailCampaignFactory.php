<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailCampaignFactory extends Factory
{
    protected $model = EmailCampaign::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'subject' => $this->faker->sentence(6),
            'content' => $this->faker->paragraph(),
            'template_id' => EmailTemplate::factory(),
            'status' => $this->faker->randomElement(['draft', 'scheduled', 'sent', 'paused', 'cancelled', 'failed']),
            'scheduled_at' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('+1 day', '+1 month') : null,
            'sent_at' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'total_recipients' => $this->faker->numberBetween(100, 10000),
            'sent_count' => $this->faker->numberBetween(50, 5000),
            'opened_count' => $this->faker->numberBetween(10, 1000),
            'clicked_count' => $this->faker->numberBetween(5, 500),
            'bounced_count' => $this->faker->numberBetween(0, 50),
            'settings' => json_encode([]),
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'list_id' => EmailList::factory(),
            'segment_id' => $this->faker->boolean(50) ? EmailSegment::factory() : null,
        ];
    }

    public function draft(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'scheduled_at' => null,
            'sent_at' => null,
        ]);
    }

    public function scheduled(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_at' => $this->faker->dateTimeBetween('+1 day', '+1 month'),
            'sent_at' => null,
        ]);
    }

    public function sent(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'scheduled_at' => $this->faker->dateTimeBetween('-1 month', '-1 day'),
            'sent_at' => $this->faker->dateTimeBetween('-1 day', 'now'),
        ]);
    }
}
