<?php

namespace Database\Factories\SocialBuffer;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShortenedLinkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ShortenedLink::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'short_code' => Str::random(6),
            'long_url' => $this->faker->url(),
            'clicks' => $this->faker->numberBetween(0, 1000),
        ];
    }

    /**
     * Indicate a specific click count.
     *
     * @param int $count
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withClicks(int $count)
    {
        return $this->state(function (array $attributes) use ($count) {
            return [
                'clicks' => $count,
            ];
        });
    }
}
