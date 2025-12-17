<?php

namespace Database\Factories;

use App\Domains\EmailMarketing\Models\EmailCampaign;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailCampaignFactory extends Factory
{
    protected $model = EmailCampaign::class;

    public function definition(): array
    {
        return [
            'name' => fake()->sentence(4),
            'subject' => fake()->sentence(6),
            'from_name' => fake()->company(),
            'from_email' => fake()->companyEmail(),
            'reply_to' => fake()->companyEmail(),
            'content' => fake()->paragraphs(3, true),
            'status' => fake()->randomElement(['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled']),
            'scheduled_at' => fake()->optional()->dateTimeBetween('now', '+30 days'),
            'sent_at' => null,
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'recipients_count' => fake()->numberBetween(100, 10000),
            'sent_count' => 0,
            'opened_count' => 0,
            'clicked_count' => 0,
            'settings' => [
                'track_opens' => true,
                'track_clicks' => true,
            ],
        ];
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_at' => fake()->dateTimeBetween('now', '+7 days'),
        ]);
    }

    public function sent(): static
    {
        $sent = fake()->numberBetween(100, 1000);
        $opened = fake()->numberBetween(20, $sent);
        $clicked = fake()->numberBetween(5, $opened);
        
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'sent_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'sent_count' => $sent,
            'opened_count' => $opened,
            'clicked_count' => $clicked,
        ]);
    }
}
