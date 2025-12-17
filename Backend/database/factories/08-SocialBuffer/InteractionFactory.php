<?php

namespace Database\Factories\SocialBuffer;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class InteractionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Interaction::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'social_account_id' => SocialAccount::factory(),
            'platform' => $this->faker->randomElement(['facebook', 'instagram', 'twitter']),
            'platform_interaction_id' => $this->faker->unique()->uuid(),
            'type' => $this->faker->randomElement(['comment', 'message', 'like', 'share']),
            'content' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['new', 'replied', 'archived']),
            'received_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'last_replied_at' => $this->faker->boolean(50) ? now() : null,
        ];
    }
}
