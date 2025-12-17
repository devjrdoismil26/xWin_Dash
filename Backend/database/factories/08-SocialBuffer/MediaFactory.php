<?php

namespace Database\Factories\SocialBuffer;

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
        $fileType = $this->faker->randomElement(['image', 'video']);
        $mimeType = ($fileType === 'image') ? 'image/jpeg' : 'video/mp4';
        $extension = ($fileType === 'image') ? 'jpg' : 'mp4';

        return [
            'user_id' => User::factory(),
            'file_name' => $this->faker->word() . '.' . $extension,
            'file_path' => 'socialbuffer/media/' . $this->faker->uuid() . '.' . $extension,
            'file_type' => $fileType,
            'mime_type' => $mimeType,
            'file_size' => $this->faker->numberBetween(10000, 5000000), // 10KB to 5MB
            'disk' => 'public',
            'metadata' => [
                'width' => $this->faker->numberBetween(800, 1920),
                'height' => $this->faker->numberBetween(600, 1080),
            ],
        ];
    }
}
