<?php

namespace Database\Factories\ADStool;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class ADSCampaignFactory extends Factory
{
    protected $model = ADSCampaign::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'project_id' => 1,
            'status' => $this->faker->randomElement(['draft', 'active', 'finished']),
        ];
    }
} 
