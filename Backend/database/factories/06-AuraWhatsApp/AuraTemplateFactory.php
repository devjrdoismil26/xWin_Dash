<?php

namespace Database\Factories\Aura;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraTemplateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AuraTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'project_id' => Project::factory(),
            'name' => $this->faker->unique()->words(2, true) . ' Template',
            'provider_template_name' => $this->faker->unique()->slug(),
            'category' => $this->faker->randomElement(['marketing', 'utility', 'authentication']),
            'language' => $this->faker->randomElement(['pt_BR', 'en_US']),
            'components' => [
                ['type' => 'BODY', 'text' => $this->faker->paragraph()],
                ['type' => 'BUTTONS', 'buttons' => [['type' => 'QUICK_REPLY', 'text' => 'Sim'], ['type' => 'QUICK_REPLY', 'text' => 'Não']]],
            ],
            'status' => $this->faker->randomElement(['approved', 'pending_approval', 'rejected']),
        ];
    }

    /**
     * Indicate that the template is approved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function approved()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved',
            ];
        });
    }
}
