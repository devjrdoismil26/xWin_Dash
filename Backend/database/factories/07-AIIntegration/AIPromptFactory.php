<?php

namespace Database\Factories\AI;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AIPromptFactory extends Factory
{
    protected $model = AIPrompt::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'name' => $this->faker->unique()->sentence(3),
            'prompt_text' => $this->faker->paragraph(),
            'model_id' => AIModel::factory(),
            'category' => $this->faker->randomElement(['marketing', 'sales', 'support', 'general']),
        ];
    }
}
