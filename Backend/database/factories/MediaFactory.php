<?php

namespace Database\Factories;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains$1\Domain$2
 */
class MediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Media::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'name' => fake()->word() . '.' . fake()->fileExtension(),
            'original_name' => fake()->word() . '_original.' . fake()->fileExtension(),
            'file_path' => fake()->filePath(),
            'disk' => fake()->randomElement(['public', 's3', 'local']),
            'mime_type' => fake()->mimeType(),
            'file_size' => fake()->numberBetween(1024, 10485760), // 1KB to 10MB
            'dimensions' => fake()->optional()->randomElement([
                ['width' => 1920, 'height' => 1080],
                ['width' => 1280, 'height' => 720],
                ['width' => 800, 'height' => 600],
            ]),
            'hash' => fake()->sha256(),
            'folder_id' => fake()->optional()->uuid(),
            'project_id' => \App\Domains$1\Domain$2
            'user_id' => \App\Domains$1\Domain$2
            'metadata' => [
                'alt_text' => fake()->optional()->sentence(),
                'caption' => fake()->optional()->sentence(),
                'tags' => fake()->words(3),
            ],
            'variants' => fake()->optional()->randomElement([
                ['thumbnail' => 'path/to/thumb.jpg', 'medium' => 'path/to/medium.jpg'],
                ['webp' => 'path/to/image.webp', 'avif' => 'path/to/image.avif'],
            ]),
            'is_public' => fake()->boolean(),
            'downloads_count' => fake()->numberBetween(0, 1000),
        ];
    }

    /**
     * Indicate that the media is an image.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => fake()->randomElement(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
            'dimensions' => ['width' => fake()->numberBetween(800, 1920), 'height' => fake()->numberBetween(600, 1080)],
        ]);
    }

    /**
     * Indicate that the media is a video.
     */
    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => fake()->randomElement(['video/mp4', 'video/avi', 'video/mov']),
            'dimensions' => ['width' => 1920, 'height' => 1080, 'duration' => fake()->numberBetween(10, 600)],
        ]);
    }

    /**
     * Indicate that the media is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }
}
