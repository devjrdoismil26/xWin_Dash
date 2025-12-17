<?php

namespace Database\Factories\Aura;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraUraSessionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AuraUraSession::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'aura_chat_id' => AuraChat::factory(),
            'aura_flow_id' => AuraFlow::factory(),
            'current_aura_flow_node_id' => AuraFlowNode::factory(),
            'status' => $this->faker->randomElement(['active', 'completed', 'cancelled']),
            'collected_data' => [],
            'started_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'ended_at' => $this->faker->boolean(50) ? now() : null,
        ];
    }

    /**
     * Indicate that the session is completed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function completed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
                'ended_at' => now(),
            ];
        });
    }
}
