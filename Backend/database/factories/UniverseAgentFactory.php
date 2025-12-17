<?php

namespace Database\Factories;

use App\Domains\Universe\Models\UniverseAgent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\UniverseAgent>
 */
class UniverseAgentFactory extends Factory
{
    protected $model = UniverseAgent::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['chatbot', 'assistant', 'analyzer', 'generator', 'custom']);
        
        return [
            'name' => $this->faker->firstName() . ' ' . ucfirst($type),
            'description' => $this->faker->paragraph(),
            'type' => $type,
            'configuration' => $this->getConfigurationByType($type),
            'status' => $this->faker->randomElement(['active', 'inactive', 'training', 'error']),
            'user_id' => 1, // Will be overridden in seeder
            'metadata' => [
                'version' => $this->faker->randomElement(['1.0.0', '1.1.0', '2.0.0']),
                'language' => $this->faker->randomElement(['pt-BR', 'en-US', 'es-ES']),
                'last_trained' => now()->subDays($this->faker->numberBetween(1, 30))->toISOString(),
                'performance_score' => $this->faker->randomFloat(2, 0.6, 1.0),
                'total_interactions' => $this->faker->numberBetween(0, 10000)
            ]
        ];
    }

    /**
     * Get configuration based on agent type.
     *
     * @param string $type
     * @return array<string, mixed>
     */
    private function getConfigurationByType(string $type): array
    {
        return match($type) {
            'chatbot' => [
                'personality' => $this->faker->randomElement(['friendly', 'professional', 'casual', 'formal']),
                'response_style' => $this->faker->randomElement(['concise', 'detailed', 'conversational']),
                'max_tokens' => $this->faker->numberBetween(100, 2000),
                'temperature' => $this->faker->randomFloat(1, 0.1, 1.0),
                'context_window' => $this->faker->numberBetween(2000, 8000),
                'fallback_responses' => [
                    'Desculpe, não entendi. Pode reformular?',
                    'Preciso de mais informações para ajudar.',
                    'Não tenho certeza sobre isso.'
                ]
            ],
            'assistant' => [
                'capabilities' => $this->faker->randomElements([
                    'schedule_meetings', 'send_emails', 'create_documents', 'analyze_data', 'generate_reports'
                ], 3),
                'working_hours' => [
                    'start' => '09:00',
                    'end' => '18:00',
                    'timezone' => 'America/Sao_Paulo'
                ],
                'integrations' => $this->faker->randomElements([
                    'google_calendar', 'slack', 'notion', 'trello', 'gmail'
                ], 2)
            ],
            'analyzer' => [
                'analysis_types' => $this->faker->randomElements([
                    'sentiment', 'text_classification', 'data_insights', 'trend_analysis'
                ], 2),
                'output_format' => $this->faker->randomElement(['json', 'csv', 'report']),
                'confidence_threshold' => $this->faker->randomFloat(2, 0.7, 0.95),
                'batch_processing' => $this->faker->boolean()
            ],
            'generator' => [
                'content_types' => $this->faker->randomElements([
                    'text', 'images', 'code', 'reports', 'presentations'
                ], 2),
                'quality_level' => $this->faker->randomElement(['draft', 'standard', 'high', 'premium']),
                'custom_prompts' => [
                    'creative' => 'Generate creative and engaging content',
                    'technical' => 'Create detailed technical documentation',
                    'marketing' => 'Produce compelling marketing copy'
                ]
            ],
            default => [
                'custom_settings' => [
                    'setting_1' => $this->faker->word(),
                    'setting_2' => $this->faker->numberBetween(1, 100),
                    'setting_3' => $this->faker->boolean()
                ]
            ]
        };
    }

    /**
     * Indicate that the agent is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the agent is in training.
     */
    public function training(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'training',
        ]);
    }

    /**
     * Create a chatbot agent.
     */
    public function chatbot(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'chatbot',
            'configuration' => $this->getConfigurationByType('chatbot'),
        ]);
    }

    /**
     * Create an assistant agent.
     */
    public function assistant(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'assistant',
            'configuration' => $this->getConfigurationByType('assistant'),
        ]);
    }
}