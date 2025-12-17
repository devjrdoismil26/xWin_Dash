<?php

namespace Database\Factories\Leads;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadCustomFieldFactory extends Factory
{
    protected $model = LeadCustomField::class;

    public function definition(): array
    {
        return [
            'project_id' => \App\Domains$1\Domain$2
            'name' => $this->faker->unique()->word(),
            'type' => $type = $this->faker->randomElement(['text', 'number', 'date', 'select', 'checkbox']),
            'is_required' => $this->faker->boolean(30),
            'display_order' => $this->faker->numberBetween(1, 10),
            'options' => in_array($type, ['select', 'checkbox']) ? $this->faker->words(3) : null,
        ];
    }
} 
