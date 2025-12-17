<?php

namespace Database\Factories;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains$1\Domain$2
 */
class FolderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Folder::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'name' => fake()->words(2, true),
            'slug' => fake()->slug(),
            'description' => fake()->optional()->sentence(),
            'parent_id' => fake()->optional()->uuid(),
            'project_id' => \App\Domains$1\Domain$2
            'user_id' => \App\Domains$1\Domain$2
            'settings' => [
                'visibility' => fake()->randomElement(['private', 'public', 'team']),
                'max_files' => fake()->optional()->numberBetween(10, 1000),
                'allowed_types' => fake()->randomElements(['image', 'video', 'audio', 'document'], 2),
            ],
            'files_count' => fake()->numberBetween(0, 100),
            'total_size' => fake()->numberBetween(0, 1073741824), // 1GB max
        ];
    }

}
