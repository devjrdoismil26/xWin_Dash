<?php

namespace Database\Factories;

use App\Domains\SocialBuffer\Models\SocialPost;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SocialPostFactory extends Factory
{
    protected $model = SocialPost::class;

    public function definition(): array
    {
        return [
            'content' => fake()->paragraph(),
            'platform' => fake()->randomElement(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok']),
            'status' => fake()->randomElement(['draft', 'scheduled', 'published', 'failed']),
            'scheduled_at' => fake()->optional()->dateTimeBetween('now', '+30 days'),
            'published_at' => null,
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'media_urls' => fake()->optional()->randomElements([
                fake()->imageUrl(1200, 630, 'social'),
                fake()->imageUrl(1200, 630, 'social'),
            ], fake()->numberBetween(0, 2)),
            'metrics' => [
                'likes' => 0,
                'comments' => 0,
                'shares' => 0,
                'impressions' => 0,
            ],
            'settings' => [
                'auto_publish' => true,
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

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'metrics' => [
                'likes' => fake()->numberBetween(10, 1000),
                'comments' => fake()->numberBetween(0, 100),
                'shares' => fake()->numberBetween(0, 50),
                'impressions' => fake()->numberBetween(100, 10000),
            ],
        ]);
    }
}
