<?php

namespace Database\Factories\Aura;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowNodeModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraFlowNodeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AuraFlowNodeModel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'flow_id' => AuraFlowModel::factory(),
            'type' => $this->faker->randomElement(['message', 'question', 'action', 'condition']),
            'name' => $this->faker->words(2, true),
            'config' => ['text' => $this->faker->sentence()],
            'position' => ['x' => $this->faker->numberBetween(0, 500), 'y' => $this->faker->numberBetween(0, 500)],
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (AuraFlowNodeModel $node) {
            // Se for um nó de pergunta, criar algumas opções de resposta como nós filhos
            if ($node->type === 'question') {
                AuraFlowNodeModel::factory()->count(rand(1, 3))->create([
                    'parent_node_id' => $node->id, 
                    'flow_id' => $node->flow_id, 
                    'type' => 'message'
                ]);
            }
        });
    }
}
