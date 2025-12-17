<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SettingFactory extends Factory
{
    protected $model = Setting::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'key' => $this->faker->word(),
            'data' => json_encode(['key' => $this->faker->word(), 'value' => $this->faker->word()]),
            'project_id' => Project::factory(),
        ];
    }
} 
