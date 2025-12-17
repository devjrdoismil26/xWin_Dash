<?php

namespace Database\Factories\Domains\AI\Models;

use App\Domains\AI\Models\AIGeneration;
use App\Domains\AI\Enums\AIGenerationStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class AIGenerationFactory extends Factory
{
    protected $model = AIGeneration::class;

    public function definition(): array
    {
        $providers = [
            'openai',
            'anthropic',
            'google',
            'azure',
            'aws_bedrock',
            'huggingface',
            'cohere',
            'replicate',
            'together',
            'perplexity'
        ];

        $models = [
            'gpt-4',
            'gpt-4-turbo',
            'gpt-3.5-turbo',
            'claude-3-opus',
            'claude-3-sonnet',
            'claude-3-haiku',
            'gemini-pro',
            'gemini-pro-vision',
            'llama-2-70b',
            'llama-3-70b',
            'mistral-7b',
            'mixtral-8x7b',
            'codellama-34b',
            'starcoder-15b',
            'wizardcoder-15b'
        ];

        $statuses = [
            AIGenerationStatus::PENDING,
            AIGenerationStatus::PROCESSING,
            AIGenerationStatus::COMPLETED,
            AIGenerationStatus::FAILED
        ];

        $provider = $this->faker->randomElement($providers);
        $model = $this->faker->randomElement($models);
        $status = $this->faker->randomElement($statuses);

        return [
            'user_id' => $this->faker->uuid(),
            'provider' => $provider,
            'model' => $model,
            'prompt' => $this->generatePrompt(),
            'response_content' => $status === AIGenerationStatus::COMPLETED ? $this->generateResponse() : null,
            'status' => $status,
            'usage_meta' => $status === AIGenerationStatus::COMPLETED ? $this->generateUsageMeta() : null,
            'error_message' => $status === AIGenerationStatus::FAILED ? $this->generateErrorMessage() : null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AIGenerationStatus::PENDING,
            'response_content' => null,
            'usage_meta' => null,
            'error_message' => null,
        ]);
    }

    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AIGenerationStatus::PROCESSING,
            'response_content' => null,
            'usage_meta' => null,
            'error_message' => null,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AIGenerationStatus::COMPLETED,
            'response_content' => $this->generateResponse(),
            'usage_meta' => $this->generateUsageMeta(),
            'error_message' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AIGenerationStatus::FAILED,
            'response_content' => null,
            'usage_meta' => null,
            'error_message' => $this->generateErrorMessage(),
        ]);
    }

    public function openai(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'openai',
            'model' => $this->faker->randomElement(['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']),
            'usage_meta' => $this->generateOpenAIUsageMeta(),
        ]);
    }

    public function anthropic(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'anthropic',
            'model' => $this->faker->randomElement(['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']),
            'usage_meta' => $this->generateAnthropicUsageMeta(),
        ]);
    }

    public function google(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'google',
            'model' => $this->faker->randomElement(['gemini-pro', 'gemini-pro-vision']),
            'usage_meta' => $this->generateGoogleUsageMeta(),
        ]);
    }

    private function generatePrompt(): string
    {
        $prompts = [
            'Write a professional email to a client about project updates.',
            'Explain the concept of machine learning in simple terms.',
            'Create a creative story about a robot learning to paint.',
            'Generate a list of 10 innovative startup ideas for 2024.',
            'Write a technical documentation for a REST API endpoint.',
            'Create a marketing copy for a new mobile app.',
            'Explain the benefits of renewable energy sources.',
            'Write a product description for an eco-friendly water bottle.',
            'Generate a business plan outline for a tech startup.',
            'Create a social media post about sustainable living.',
            'Write a code review checklist for Python developers.',
            'Explain the concept of blockchain technology.',
            'Generate a list of interview questions for a software engineer.',
            'Create a user manual for a smart home device.',
            'Write a press release for a new product launch.',
            'Explain the importance of data privacy in the digital age.',
            'Generate a list of best practices for remote work.',
            'Create a training outline for customer service representatives.',
            'Write a proposal for implementing AI in business processes.',
            'Explain the concept of microservices architecture.'
        ];

        return $this->faker->randomElement($prompts);
    }

    private function generateResponse(): string
    {
        $responses = [
            'Based on your request, here is a comprehensive response that addresses all the key points you mentioned. This solution takes into account the current market trends and best practices in the industry.',
            'I understand your requirements and have prepared a detailed analysis. The key findings suggest that implementing this approach would yield significant benefits in terms of efficiency and cost-effectiveness.',
            'Thank you for your question. Here is a step-by-step guide that will help you achieve your goals while maintaining high quality standards and following industry best practices.',
            'After careful consideration of your needs, I recommend the following approach. This solution has been tested and proven effective in similar scenarios.',
            'I\'ve analyzed your request and prepared a comprehensive response. The solution I\'m proposing addresses all the requirements you\'ve specified and includes additional recommendations for optimization.',
            'Based on my analysis, here are the key insights and recommendations. This approach has been successfully implemented in similar projects and has shown excellent results.',
            'I understand your requirements and have developed a solution that meets all your criteria. The implementation includes best practices and follows industry standards.',
            'Here is a detailed response to your request. The solution I\'m proposing is scalable, maintainable, and follows current best practices in the field.',
            'After reviewing your requirements, I\'ve prepared a comprehensive solution. This approach has been validated through testing and has shown positive results.',
            'I\'ve carefully considered your needs and developed a solution that addresses all the key points. The implementation includes proper error handling and follows security best practices.'
        ];

        return $this->faker->randomElement($responses);
    }

    private function generateUsageMeta(): array
    {
        return [
            'prompt_tokens' => $this->faker->numberBetween(50, 2000),
            'completion_tokens' => $this->faker->numberBetween(100, 3000),
            'total_tokens' => $this->faker->numberBetween(150, 5000),
            'cost' => $this->faker->randomFloat(4, 0.001, 0.1),
            'processing_time' => $this->faker->numberBetween(1, 30),
            'model_version' => $this->faker->randomElement(['v1', 'v2', 'v3']),
            'temperature' => $this->faker->randomFloat(2, 0.1, 2.0),
            'max_tokens' => $this->faker->numberBetween(100, 4000),
            'top_p' => $this->faker->randomFloat(2, 0.1, 1.0),
            'frequency_penalty' => $this->faker->randomFloat(2, 0.0, 2.0),
            'presence_penalty' => $this->faker->randomFloat(2, 0.0, 2.0),
            'stop_sequences' => $this->faker->optional(0.3)->words(2),
            'logit_bias' => $this->faker->optional(0.2)->randomElements([
                'positive' => $this->faker->numberBetween(1, 100),
                'negative' => $this->faker->numberBetween(-100, -1)
            ], $this->faker->numberBetween(1, 3)),
            'metadata' => [
                'request_id' => $this->faker->uuid(),
                'timestamp' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s'),
                'user_agent' => $this->faker->userAgent(),
                'ip_address' => $this->faker->ipv4(),
                'session_id' => $this->faker->uuid()
            ]
        ];
    }

    private function generateOpenAIUsageMeta(): array
    {
        return array_merge($this->generateUsageMeta(), [
            'finish_reason' => $this->faker->randomElement(['stop', 'length', 'content_filter']),
            'logprobs' => $this->faker->optional(0.3)->randomElements([
                'token' => $this->faker->word(),
                'logprob' => $this->faker->randomFloat(4, -10, 0),
                'bytes' => $this->faker->optional(0.5)->randomElements([], $this->faker->numberBetween(1, 5))
            ], $this->faker->numberBetween(1, 3))
        ]);
    }

    private function generateAnthropicUsageMeta(): array
    {
        return array_merge($this->generateUsageMeta(), [
            'stop_reason' => $this->faker->randomElement(['end_turn', 'max_tokens', 'stop_sequence']),
            'stop_sequence' => $this->faker->optional(0.2)->word(),
            'truncated' => $this->faker->boolean(10),
            'truncation_offset' => $this->faker->optional(0.1)->numberBetween(1, 100)
        ]);
    }

    private function generateGoogleUsageMeta(): array
    {
        return array_merge($this->generateUsageMeta(), [
            'finish_reason' => $this->faker->randomElement(['STOP', 'MAX_TOKENS', 'SAFETY']),
            'safety_ratings' => $this->faker->randomElements([
                [
                    'category' => $this->faker->randomElement(['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH']),
                    'probability' => $this->faker->randomElement(['NEGLIGIBLE', 'LOW', 'MEDIUM', 'HIGH'])
                ],
                [
                    'category' => $this->faker->randomElement(['HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT']),
                    'probability' => $this->faker->randomElement(['NEGLIGIBLE', 'LOW', 'MEDIUM', 'HIGH'])
                ]
            ], $this->faker->numberBetween(1, 2))
        ]);
    }

    private function generateErrorMessage(): string
    {
        $errors = [
            'Rate limit exceeded. Please try again later.',
            'Invalid API key provided.',
            'Model not found or not available.',
            'Request timeout. The operation took too long to complete.',
            'Insufficient credits or quota exceeded.',
            'Invalid request format or parameters.',
            'Service temporarily unavailable.',
            'Content policy violation detected.',
            'Network connection error.',
            'Internal server error occurred.',
            'Authentication failed.',
            'Request size exceeds maximum allowed limit.',
            'Unsupported model version.',
            'Invalid prompt format.',
            'Processing failed due to resource constraints.'
        ];

        return $this->faker->randomElement($errors);
    }
}