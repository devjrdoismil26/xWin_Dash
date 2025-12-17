<?php

namespace Database\Factories;

use App\Domains\Leads\Models\Lead;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'company' => fake()->company(),
            'position' => fake()->jobTitle(),
            'status' => fake()->randomElement(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
            'score' => fake()->numberBetween(0, 100),
            'source' => fake()->randomElement(['website', 'facebook', 'google', 'referral', 'direct']),
            'notes' => fake()->paragraph(),
            'project_id' => Project::factory(),
            'assigned_to' => User::factory(),
            'last_activity_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'metadata' => [
                'utm_source' => fake()->word(),
                'utm_campaign' => fake()->word(),
            ],
        ];
    }

    public function qualified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'qualified',
            'score' => fake()->numberBetween(70, 100),
        ]);
    }

    public function won(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'won',
            'score' => 100,
        ]);
    }
}
