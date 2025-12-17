<?php

namespace Database\Factories\Leads;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadHistoryFactory extends Factory
{
    protected $model = LeadHistory::class;

    public function definition(): array
    {
        return [
            'lead_id' => \App\Domains$1\Domain$2
            'action' => $this->faker->randomElement(['create', 'update', 'delete']),
            'description' => $this->faker->sentence(6),
            'changes' => null,
            'user_id' => null,
        ];
    }
} 
