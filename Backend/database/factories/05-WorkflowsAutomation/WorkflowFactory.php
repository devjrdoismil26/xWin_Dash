<?php

namespace Database\Factories\Workflows;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowFactory extends Factory
{
    protected $model = Workflow::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'is_active' => $this->faker->boolean(80),
            'trigger_type' => $this->faker->randomElement(['lead_created', 'webhook', 'whatsapp_message']),
            'trigger_config' => [],
            'definition' => [
                'drawflow' => [
                    'Home' => [
                        'data' => [
                            // Basic example node
                            'node_1' => [
                                'id' => 'node_1',
                                'name' => 'start',
                                'data' => [],
                                'class' => 'start',
                                'html' => 'Start',
                                'inputs' => [],
                                'outputs' => [
                                    'output_1' => [
                                        'connections' => [
                                            ['node' => 'node_2', 'output' => 'input_1', 'data' => []]
                                        ]
                                    ]
                                ],
                                'pos_x' => 50,
                                'pos_y' => 50,
                                'typenode' => false,
                            ],
                            'node_2' => [
                                'id' => 'node_2',
                                'name' => 'email',
                                'data' => [
                                    'config' => [
                                        'to' => 'test@example.com',
                                        'subject' => 'Workflow Test',
                                        'body' => 'This is a test email from workflow.'
                                    ]
                                ],
                                'class' => 'email',
                                'html' => 'Send Email',
                                'inputs' => [
                                    'input_1' => [
                                        'connections' => [
                                            ['node' => 'node_1', 'input' => 'output_1', 'data' => []]
                                        ]
                                    ]
                                ],
                                'outputs' => [],
                                'pos_x' => 300,
                                'pos_y' => 50,
                                'typenode' => false,
                            ],
                        ]
                    ]
                ]
            ],
        ];
    }

    public function inactive(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function withUser(User $user): Factory
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $user->current_project_id,
        ]);
    }
}
