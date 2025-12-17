<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ActivityLogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ActivityLog::class;

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
            'subject_type' => $this->faker->randomElement(['App\\Domains\\Leads\\Models\\Lead', 'App\\Domains\\EmailMarketing\\Models\\EmailCampaign']),
            'subject_id' => $this->faker->uuid(),
            'event' => $this->faker->randomElement(['created', 'updated', 'deleted', 'viewed']),
            'description' => $this->faker->sentence(),
            'properties' => json_encode([]),
            'batch_uuid' => $this->faker->uuid(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
        ];
    }
}
