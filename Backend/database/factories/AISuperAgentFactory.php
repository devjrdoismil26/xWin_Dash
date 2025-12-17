<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\AISuperAgent>
 */
class AISuperAgentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'type' => $this->faker->randomElement(['marketing', 'sales', 'analytics', 'security', 'support', 'content']),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'training', 'error']),
            'performance' => [
                'accuracy' => $this->faker->randomFloat(2, 70, 100),
                'speed' => $this->faker->randomFloat(2, 1, 10),
                'efficiency' => $this->faker->randomFloat(2, 80, 100),
                'uptime' => $this->faker->randomFloat(2, 95, 100),
            ],
            'metrics' => [
                'tasks_completed' => $this->faker->numberBetween(0, 1000),
                'success_rate' => $this->faker->randomFloat(2, 80, 100),
                'avg_response_time' => $this->faker->randomFloat(2, 0.1, 5),
                'data_transferred' => $this->faker->numberBetween(0, 10000),
            ],
            'capabilities' => $this->faker->words(5),
            'is_premium' => $this->faker->boolean(30),
            'is_active' => $this->faker->boolean(80),
            'configuration' => [
                'model' => $this->faker->randomElement(['gpt-4', 'claude-3', 'gemini-pro']),
                'temperature' => $this->faker->randomFloat(2, 0, 1),
                'max_tokens' => $this->faker->numberBetween(100, 4000),
            ],
            'user_id' => \App\Models\User::factory(),
            'last_activity' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
