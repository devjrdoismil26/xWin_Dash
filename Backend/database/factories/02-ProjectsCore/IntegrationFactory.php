<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class IntegrationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Integration::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => Str::uuid(),
            'name' => $this->faker->unique()->words(2, true) . ' Integration',
            'platform' => $this->faker->randomElement(['Google Ads', 'Facebook Ads', 'Mailchimp', 'Pipedrive']),
            'credentials' => ['api_key' => $this->faker->uuid(), 'secret' => $this->faker->sha256()],
            'settings' => ['sync_interval' => 'daily', 'notifications' => true],
            'is_active' => $this->faker->boolean(90),
            'last_sync_at' => $this->faker->boolean(70) ? now()->subDays(rand(1, 30)) : null,
        ];
    }

    /**
     * Indicate that the integration is inactive.
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
