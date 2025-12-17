<?php

namespace Database\Factories\Projects;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadCaptureFormFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = LeadCaptureFormModel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'project_id' => ProjectModel::factory(),
            'name' => $this->faker->unique()->words(3, true) . ' Form',
            'title' => $this->faker->unique()->words(2, true) . ' Title',
            'description' => $this->faker->paragraph(),
            'fields' => [
                ['name' => 'name', 'type' => 'text', 'label' => 'Seu Nome', 'required' => true],
                ['name' => 'email', 'type' => 'email', 'label' => 'Seu Email', 'required' => true],
                ['name' => 'phone', 'type' => 'tel', 'label' => 'Seu Telefone', 'required' => false],
            ],
            'redirect_url' => $this->faker->boolean(50) ? $this->faker->url() : null,
            'webhook_url' => $this->faker->boolean(30) ? $this->faker->url() : null,
            'is_active' => $this->faker->boolean(90),
            'button_text' => $this->faker->words(2, true) . ' Button',
        ];
    }

    /**
     * Indicate that the form is inactive.
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
