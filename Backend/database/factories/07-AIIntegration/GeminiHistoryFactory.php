<?php

namespace Database\Factories\AI;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class GeminiHistoryFactory extends Factory
{
    protected $model = GeminiHistory::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'prompt' => $this->faker->sentence(),
            'model' => 'gemini-pro',
            'response' => $this->faker->paragraph(),
            'project_id' => \App\Domains$1\Domain$2
        ];
    }
} 
