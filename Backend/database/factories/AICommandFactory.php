<?php

namespace Database\Factories;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains$1\Domain$2
 */
class AICommandFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = AICommand::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'command' => fake()->randomElement(['generate_text', 'analyze_content', 'create_summary', 'translate', 'optimize']),
            'prompt' => fake()->sentence(20),
            'parameters' => [
                'temperature' => fake()->randomFloat(2, 0, 1),
                'max_tokens' => fake()->numberBetween(100, 2000),
                'model' => fake()->randomElement(['gpt-4', 'gpt-3.5-turbo', 'gemini-pro']),
            ],
            'status' => fake()->randomElement(['pending', 'processing', 'completed', 'failed']),
            'response' => fake()->optional()->paragraph(5),
            'tokens_used' => fake()->numberBetween(50, 1500),
            'cost' => fake()->randomFloat(4, 0.001, 5.000),
            'project_id' => \App\Domains$1\Domain$2
            'user_id' => \App\Domains$1\Domain$2
            'executed_at' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the command is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'response' => null,
            'executed_at' => null,
        ]);
    }

    /**
     * Indicate that the command is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'response' => fake()->paragraph(5),
            'executed_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    /**
     * Indicate that the command failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'response' => 'Error: ' . fake()->sentence(),
            'executed_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}
