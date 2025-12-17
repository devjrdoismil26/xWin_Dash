<?php

namespace Database\Factories;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains$1\Domain$2
 */
class AIConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = AIConversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'title' => fake()->sentence(4),
            'project_id' => \App\Domains$1\Domain$2
            'user_id' => \App\Domains$1\Domain$2
            'context' => [
                'topic' => fake()->word(),
                'language' => fake()->randomElement(['pt', 'en', 'es']),
                'tone' => fake()->randomElement(['formal', 'casual', 'technical']),
            ],
            'status' => fake()->randomElement(['active', 'archived', 'deleted']),
            'message_count' => fake()->numberBetween(1, 50),
            'total_tokens' => fake()->numberBetween(100, 10000),
            'total_cost' => fake()->randomFloat(4, 0.01, 50.00),
        ];
    }

}
