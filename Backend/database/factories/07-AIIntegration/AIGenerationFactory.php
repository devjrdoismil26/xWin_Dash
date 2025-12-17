<?php

namespace Database\Factories\AI;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AIGenerationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AIGeneration::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'prompt' => $this->faker->sentence(10),
            'result' => $this->faker->paragraph(3),
            'model' => $this->faker->randomElement(['gemini-pro', 'gpt-3.5-turbo', 'claude-2']),
            'tokens_used' => $this->faker->numberBetween(50, 500),
            'status' => $this->faker->randomElement(['completed', 'failed']),
            'error_message' => $this->faker->boolean(20) ? $this->faker->sentence() : null, // 20% chance of error
        ];
    }

    /**
     * Indicate that the generation failed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function failed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'failed',
                'error_message' => $this->faker->sentence(),
            ];
        });
    }
}
