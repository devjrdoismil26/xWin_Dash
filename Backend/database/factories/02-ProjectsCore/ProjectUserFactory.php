<?php

namespace Database\Factories\Projects;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectUserFactory extends Factory
{
    protected $model = ProjectUser::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
            'role' => $this->faker->randomElement(['admin', 'member', 'viewer']),
            'permissions' => [],
        ];
    }
}
