<?php

namespace Database\Factories\SocialBuffer;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'lead_id' => $this->faker->boolean(30) ? Lead::factory() : null,
            'content' => $this->faker->paragraph(),
            'post_type' => $this->faker->randomElement(['text', 'image', 'video']),
            'platform_specific_content' => [],
            'media_urls' => $this->faker->boolean(50) ? [$this->faker->imageUrl()] : [],
            'hashtags' => $this->faker->boolean(70) ? $this->faker->words(3) : [],
            'mentions' => $this->faker->boolean(30) ? [$this->faker->userName()] : [],
            'order_column' => $this->faker->numberBetween(1, 100),
            'status' => $this->faker->randomElement(['draft', 'scheduled', 'published', 'failed']),
        ];
    }

    /**
     * Indicate that the post is a draft.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function draft()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'draft',
            ];
        });
    }

    /**
     * Indicate that the post is scheduled.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function scheduled()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'scheduled',
            ];
        });
    }

    /**
     * Indicate that the post is published.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function published()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'published',
            ];
        });
    }
}
