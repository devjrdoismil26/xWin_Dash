<?php

namespace Database\Factories;

use App\Domains\Auth\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        $name = fake()->unique()->jobTitle();
        
        return [
            'name' => Str::slug($name),
            'display_name' => $name,
            'description' => fake()->sentence(),
            'guard_name' => 'web',
            'is_system' => false,
            'level' => fake()->numberBetween(1, 10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'admin',
            'display_name' => 'Administrator',
            'description' => 'Full system access',
            'is_system' => true,
            'level' => 10,
        ]);
    }

    public function manager(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'manager',
            'display_name' => 'Manager',
            'description' => 'Project management access',
            'is_system' => true,
            'level' => 7,
        ]);
    }

    public function user(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'user',
            'display_name' => 'User',
            'description' => 'Basic user access',
            'is_system' => true,
            'level' => 3,
        ]);
    }
}
