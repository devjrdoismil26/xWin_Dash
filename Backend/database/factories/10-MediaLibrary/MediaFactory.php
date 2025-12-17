<?php

namespace Database\Factories\Media;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class MediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Media::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $mimeType = $this->faker->randomElement(['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']);
        $filename = $this->faker->slug() . '.' . explode('/', $mimeType)[1];

        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'folder_id' => Folder::factory(),
            'disk' => 'public',
            'path' => 'media/' . $filename,
            'filename' => $filename,
            'mime_type' => $mimeType,
            'size' => $this->faker->numberBetween(1024, 5242880), // 1KB to 5MB
            'alt_text' => $this->faker->sentence(3),
            'caption' => $this->faker->boolean(50) ? $this->faker->paragraph() : null,
            'tags' => $this->faker->boolean(50) ? $this->faker->words(3) : [],
        ];
    }
}
