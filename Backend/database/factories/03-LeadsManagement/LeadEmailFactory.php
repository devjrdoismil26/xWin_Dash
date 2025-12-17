<?php

namespace Database\Factories\Leads;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadEmailFactory extends Factory
{
    protected $model = LeadEmail::class;

    public function definition(): array
    {
        return [
            'lead_id' => null, // deve ser preenchido no seeder
            'campaign_id' => null,
            'subject' => $this->faker->sentence(4),
            'content' => $this->faker->paragraph(2),
            'status' => $this->faker->randomElement(['draft', 'scheduled', 'sending', 'sent', 'failed', 'bounced']),
            'sent_at' => $this->faker->optional()->dateTimeThisYear(),
            'opened_at' => $this->faker->optional()->dateTimeThisYear(),
            'clicked_at' => $this->faker->optional()->dateTimeThisYear(),
        ];
    }
} 
