<?php

namespace Database\Factories;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains$1\Domain$2
 */
class AIMessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = AIMessage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'conversation_id' => AIConversation::factory(),
            'role' => fake()->randomElement(['user', 'assistant', 'system']),
            'content' => fake()->paragraph(3),
            'metadata' => [
                'model' => fake()->randomElement(['gpt-4', 'gpt-3.5-turbo', 'gemini-pro']),
                'temperature' => fake()->randomFloat(2, 0, 1),
                'finish_reason' => fake()->randomElement(['stop', 'length', 'content_filter']),
            ],
            'tokens' => fake()->numberBetween(10, 500),
            'cost' => fake()->randomFloat(4, 0.001, 2.000),
            'sent_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

}
