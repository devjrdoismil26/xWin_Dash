<?php

namespace Database\Factories\Projects;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = ProjectModel::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(),
            'description' => $this->faker->paragraph(),
            'slug' => $this->faker->unique()->slug(),
            'is_active' => $this->faker->boolean(80),
            'owner_id' => UserModel::factory(),
            'settings' => json_encode([]),
            'modules' => json_encode([]),
        ];
    }
} 
