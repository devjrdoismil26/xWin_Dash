<?php

namespace Database\Factories;

use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $name = fake()->company();
        
        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(6),
            'description' => fake()->paragraph(),
            'logo' => fake()->imageUrl(400, 400, 'business'),
            'website' => fake()->url(),
            'industry' => fake()->randomElement(['technology', 'retail', 'healthcare', 'finance', 'education']),
            'timezone' => 'America/Sao_Paulo',
            'currency' => 'BRL',
            'is_active' => true,
            'owner_id' => User::factory(),
            'settings' => [
                'notifications_enabled' => true,
                'auto_assign_leads' => false,
            ],
            'modules' => ['leads', 'email', 'social', 'analytics'],
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
