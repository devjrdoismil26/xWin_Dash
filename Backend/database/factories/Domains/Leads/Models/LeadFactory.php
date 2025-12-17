<?php

namespace Database\Factories\Domains\Leads\Models;

use App\Domains\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        $statuses = [
            'new',
            'contacted',
            'qualified',
            'proposal',
            'negotiation',
            'closed_won',
            'closed_lost',
            'nurturing'
        ];

        $sources = [
            'website',
            'social_media',
            'email_campaign',
            'referral',
            'cold_call',
            'trade_show',
            'advertisement',
            'content_marketing',
            'search_engine',
            'direct_mail'
        ];

        $status = $this->faker->randomElement($statuses);
        $source = $this->faker->randomElement($sources);

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'company' => $this->faker->company(),
            'position' => $this->faker->jobTitle(),
            'website' => $this->faker->url(),
            'notes' => $this->faker->paragraph(),
            'source' => $source,
            'utm_source' => $this->faker->randomElement(['google', 'facebook', 'linkedin', 'twitter', 'email', 'direct']),
            'utm_medium' => $this->faker->randomElement(['cpc', 'social', 'email', 'organic', 'referral', 'display']),
            'utm_campaign' => $this->faker->words(2, true),
            'utm_content' => $this->faker->words(3, true),
            'utm_term' => $this->faker->words(2, true),
            'address' => $this->faker->address(),
            'status' => $status,
            'score' => $this->faker->numberBetween(0, 100),
            'last_activity_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'converted_at' => $status === 'closed_won' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'value' => $this->faker->randomFloat(2, 100, 10000),
            'assigned_to' => $this->faker->uuid(),
            'project_id' => $this->faker->uuid(),
        ];
    }

    public function newLead(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
            'score' => $this->faker->numberBetween(0, 30),
        ]);
    }

    public function contacted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'contacted',
            'score' => $this->faker->numberBetween(20, 50),
        ]);
    }

    public function qualified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'qualified',
            'score' => $this->faker->numberBetween(50, 80),
        ]);
    }

    public function proposal(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'proposal',
            'score' => $this->faker->numberBetween(70, 90),
        ]);
    }

    public function negotiation(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'negotiation',
            'score' => $this->faker->numberBetween(80, 95),
        ]);
    }

    public function closedWon(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed_won',
            'score' => 100,
        ]);
    }

    public function closedLost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed_lost',
            'score' => $this->faker->numberBetween(0, 30),
        ]);
    }

    public function nurturing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'nurturing',
            'score' => $this->faker->numberBetween(30, 60),
        ]);
    }

    public function website(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'website',
        ]);
    }

    public function socialMedia(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'social_media',
        ]);
    }

    public function emailCampaign(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'email_campaign',
        ]);
    }

    public function referral(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'referral',
        ]);
    }

    public function coldCall(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'cold_call',
        ]);
    }

    public function tradeShow(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'trade_show',
        ]);
    }

    public function advertisement(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'advertisement',
        ]);
    }

    public function contentMarketing(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'content_marketing',
        ]);
    }

    public function searchEngine(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'search_engine',
        ]);
    }

    public function directMail(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'direct_mail',
        ]);
    }

    public function highScore(): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => $this->faker->numberBetween(80, 100),
        ]);
    }

    public function mediumScore(): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => $this->faker->numberBetween(40, 79),
        ]);
    }

    public function lowScore(): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => $this->faker->numberBetween(0, 39),
        ]);
    }

    public function withTags(array $tags): static
    {
        return $this->state(fn (array $attributes) => [
            'tags' => $tags,
        ]);
    }

    public function withCustomFields(array $customFields): static
    {
        return $this->state(fn (array $attributes) => [
            'custom_fields' => $customFields,
        ]);
    }

    private function generateTags(): array
    {
        $allTags = [
            'hot',
            'warm',
            'cold',
            'vip',
            'enterprise',
            'small_business',
            'startup',
            'nonprofit',
            'government',
            'education',
            'healthcare',
            'finance',
            'technology',
            'retail',
            'manufacturing',
            'consulting',
            'agency',
            'freelancer',
            'international',
            'local',
            'repeat_customer',
            'new_customer',
            'high_value',
            'low_value',
            'urgent',
            'follow_up',
            'demo_requested',
            'quote_requested',
            'competitor',
            'price_sensitive'
        ];

        $numTags = $this->faker->numberBetween(1, 5);
        return $this->faker->randomElements($allTags, $numTags);
    }

    private function generateCustomFields(): array
    {
        $customFields = [];

        // Company information
        if ($this->faker->boolean(70)) {
            $customFields['company'] = $this->faker->company();
        }

        if ($this->faker->boolean(60)) {
            $customFields['job_title'] = $this->faker->jobTitle();
        }

        if ($this->faker->boolean(50)) {
            $customFields['industry'] = $this->faker->randomElement([
                'Technology',
                'Healthcare',
                'Finance',
                'Education',
                'Retail',
                'Manufacturing',
                'Consulting',
                'Real Estate',
                'Media',
                'Transportation'
            ]);
        }

        if ($this->faker->boolean(40)) {
            $customFields['company_size'] = $this->faker->randomElement([
                '1-10',
                '11-50',
                '51-200',
                '201-500',
                '501-1000',
                '1000+'
            ]);
        }

        // Contact preferences
        if ($this->faker->boolean(30)) {
            $customFields['preferred_contact_method'] = $this->faker->randomElement([
                'email',
                'phone',
                'text',
                'linkedin',
                'whatsapp'
            ]);
        }

        if ($this->faker->boolean(25)) {
            $customFields['best_time_to_contact'] = $this->faker->randomElement([
                'morning',
                'afternoon',
                'evening',
                'weekend'
            ]);
        }

        // Budget and timeline
        if ($this->faker->boolean(35)) {
            $customFields['budget_range'] = $this->faker->randomElement([
                'Under $1,000',
                '$1,000 - $5,000',
                '$5,000 - $10,000',
                '$10,000 - $25,000',
                '$25,000 - $50,000',
                '$50,000+'
            ]);
        }

        if ($this->faker->boolean(30)) {
            $customFields['timeline'] = $this->faker->randomElement([
                'Immediate',
                '1-3 months',
                '3-6 months',
                '6-12 months',
                '12+ months'
            ]);
        }

        // Additional information
        if ($this->faker->boolean(20)) {
            $customFields['pain_points'] = $this->faker->randomElements([
                'High costs',
                'Inefficient processes',
                'Lack of automation',
                'Poor customer service',
                'Outdated technology',
                'Limited scalability',
                'Security concerns',
                'Compliance issues',
                'Integration problems',
                'Training needs'
            ], $this->faker->numberBetween(1, 3));
        }

        if ($this->faker->boolean(15)) {
            $customFields['decision_makers'] = $this->faker->numberBetween(1, 5);
        }

        if ($this->faker->boolean(10)) {
            $customFields['competitors'] = $this->faker->randomElements([
                'Competitor A',
                'Competitor B',
                'Competitor C',
                'In-house solution',
                'No current solution'
            ], $this->faker->numberBetween(1, 2));
        }

        return $customFields;
    }
}