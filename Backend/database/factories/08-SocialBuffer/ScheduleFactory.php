<?php

namespace Database\Factories\SocialBuffer;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Schedule::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'post_id' => Post::factory(),
            'social_account_id' => SocialAccount::factory(),
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['pending', 'published', 'failed']),
            'platform_post_id' => $this->faker->boolean(70) ? $this->faker->uuid() : null,
            'error_message' => $this->faker->boolean(10) ? $this->faker->sentence() : null,
            'published_at' => $this->faker->boolean(70) ? now() : null,
            'retry_count' => $this->faker->numberBetween(0, 3),
            'auto_publish' => $this->faker->boolean(90),
            'notification_settings' => [],
            'timezone' => $this->faker->timezone(),
            'is_recurring' => $this->faker->boolean(20),
            'recurrence_pattern' => $this->faker->boolean(20) ? ['interval' => 'weekly', 'frequency' => 1] : null,
            'recurrence_group' => null,
            'priority' => $this->faker->numberBetween(1, 10),
        ];
    }

    /**
     * Indicate that the schedule is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'published_at' => null,
                'platform_post_id' => null,
            ];
        });
    }

    /**
     * Indicate that the schedule is published.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function published()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'published',
                'published_at' => now(),
                'platform_post_id' => $this->faker->uuid(),
            ];
        });
    }

    /**
     * Indicate that the schedule failed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function failed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'failed',
                'error_message' => $this->faker->sentence(),
            ];
        });
    }
}
