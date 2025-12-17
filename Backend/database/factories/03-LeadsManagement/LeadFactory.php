<?php

namespace Database\Factories\Leads;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'whatsapp' => $this->faker->unique()->e164PhoneNumber(),
            'status' => $this->faker->randomElement(['novo', 'contatado', 'convertido']),
            'project_id' => \App\Domains$1\Domain$2
        ];
    }
} 
