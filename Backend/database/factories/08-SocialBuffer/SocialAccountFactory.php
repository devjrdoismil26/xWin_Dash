<?php

namespace Database\Factories\SocialBuffer;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class SocialAccountFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SocialAccount::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $platform = $this->faker->randomElement(['facebook', 'instagram', 'twitter', 'linkedin']);

        return [
            'user_id' => User::factory(),
            'platform' => $platform,
            'account_id' => $this->faker->unique()->uuid(),
            'account_name' => $this->faker->company(),
            'username' => $this->faker->userName(),
            'access_token' => $this->faker->sha256(),
            'refresh_token' => $this->faker->boolean(50) ? $this->faker->sha256() : null,
            'token_expires_at' => $this->faker->boolean(80) ? now()->addDays(rand(1, 365)) : null,
            'account_metadata' => [],
            'posting_permissions' => [
                'can_post' => true,
                'allowed_types' => ['text', 'image', 'video'],
            ],
            'is_active' => $this->faker->boolean(90),
            'last_used_at' => $this->faker->boolean(70) ? now() : null,
        ];
    }

    /**
     * Indicate that the account is inactive.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inactive()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_active' => false,
            ];
        });
    }
}
