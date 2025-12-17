<?php

namespace Database\Factories\AI;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AIGeneratedContentFactory extends Factory
{
    protected $model = AIGeneratedContent::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'lead_id' => $this->faker->boolean(50) ? Lead::factory() : null,
            'prompt_id' => $this->faker->boolean(70) ? AIPrompt::factory() : null,
            'input_data' => [],
            'output_text' => $this->faker->paragraph(),
            'model_used_id' => $this->faker->boolean(80) ? AIModel::factory() : null,
            'generated_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
