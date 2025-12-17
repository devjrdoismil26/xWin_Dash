<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\AI\Infrastructure\Persistence\Eloquent\AIModelModel;
use Illuminate\Support\Str;

class AIModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $models = [
            // OpenAI Models
            [
                'id' => Str::uuid(),
                'name' => 'GPT-4 Turbo',
                'provider' => 'openai',
                'model_id' => 'gpt-4-turbo-preview',
                'description' => 'Most capable GPT-4 model with enhanced performance',
                'type' => 'text',
                'capabilities' => ['text_generation', 'conversation', 'code_generation', 'analysis'],
                'config' => ['temperature_range' => [0, 2], 'max_tokens_limit' => 4096],
                'cost_per_token' => 0.00001,
                'max_tokens' => 4096,
                'context_window' => 128000,
                'supports_streaming' => true,
                'supports_functions' => true,
                'is_active' => true,
            ],
            [
                'id' => Str::uuid(),
                'name' => 'GPT-3.5 Turbo',
                'provider' => 'openai',
                'model_id' => 'gpt-3.5-turbo',
                'description' => 'Fast and efficient model for most tasks',
                'type' => 'text',
                'capabilities' => ['text_generation', 'conversation', 'code_generation'],
                'config' => ['temperature_range' => [0, 2], 'max_tokens_limit' => 4096],
                'cost_per_token' => 0.0000015,
                'max_tokens' => 4096,
                'context_window' => 16385,
                'supports_streaming' => true,
                'supports_functions' => true,
                'is_active' => true,
            ],
            [
                'id' => Str::uuid(),
                'name' => 'DALL-E 3',
                'provider' => 'openai',
                'model_id' => 'dall-e-3',
                'description' => 'Advanced image generation model',
                'type' => 'image',
                'capabilities' => ['image_generation'],
                'config' => ['sizes' => ['1024x1024', '1792x1024', '1024x1792'], 'quality' => ['standard', 'hd']],
                'cost_per_token' => 0.04,
                'max_tokens' => null,
                'context_window' => null,
                'supports_streaming' => false,
                'supports_functions' => false,
                'is_active' => true,
            ],

            // Google Gemini Models
            [
                'id' => Str::uuid(),
                'name' => 'Gemini 1.5 Pro',
                'provider' => 'gemini',
                'model_id' => 'gemini-1.5-pro',
                'description' => 'Google\'s most capable multimodal model',
                'type' => 'multimodal',
                'capabilities' => ['text_generation', 'conversation', 'image_analysis', 'code_generation', 'multimodal'],
                'config' => ['temperature_range' => [0, 2], 'top_p_range' => [0, 1], 'top_k_range' => [1, 40]],
                'cost_per_token' => 0.000007,
                'max_tokens' => 8192,
                'context_window' => 1000000,
                'supports_streaming' => true,
                'supports_functions' => true,
                'is_active' => true,
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Gemini 1.5 Flash',
                'provider' => 'gemini',
                'model_id' => 'gemini-1.5-flash',
                'description' => 'Fast and efficient Gemini model',
                'type' => 'multimodal',
                'capabilities' => ['text_generation', 'conversation', 'image_analysis'],
                'config' => ['temperature_range' => [0, 2], 'top_p_range' => [0, 1], 'top_k_range' => [1, 40]],
                'cost_per_token' => 0.000002,
                'max_tokens' => 8192,
                'context_window' => 1000000,
                'supports_streaming' => true,
                'supports_functions' => true,
                'is_active' => true,
            ],

            // Anthropic Claude Models
            [
                'id' => Str::uuid(),
                'name' => 'Claude 3 Opus',
                'provider' => 'claude',
                'model_id' => 'claude-3-opus-20240229',
                'description' => 'Anthropic\'s most powerful model for complex tasks',
                'type' => 'text',
                'capabilities' => ['text_generation', 'conversation', 'analysis', 'creative_writing', 'code_generation'],
                'config' => ['temperature_range' => [0, 1], 'max_tokens_limit' => 4096],
                'cost_per_token' => 0.000015,
                'max_tokens' => 4096,
                'context_window' => 200000,
                'supports_streaming' => true,
                'supports_functions' => true,
                'is_active' => true,
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Claude 3 Sonnet',
                'provider' => 'claude',
                'model_id' => 'claude-3-sonnet-20240229',
                'description' => 'Balanced performance and speed',
                'type' => 'text',
                'capabilities' => ['text_generation', 'conversation', 'analysis', 'code_generation'],
                'config' => ['temperature_range' => [0, 1], 'max_tokens_limit' => 4096],
                'cost_per_token' => 0.000003,
                'max_tokens' => 4096,
                'context_window' => 200000,
                'supports_streaming' => true,
                'supports_functions' => true,
                'is_active' => true,
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Claude 3 Haiku',
                'provider' => 'claude',
                'model_id' => 'claude-3-haiku-20240307',
                'description' => 'Fast and cost-effective for simple tasks',
                'type' => 'text',
                'capabilities' => ['text_generation', 'conversation'],
                'config' => ['temperature_range' => [0, 1], 'max_tokens_limit' => 4096],
                'cost_per_token' => 0.00000025,
                'max_tokens' => 4096,
                'context_window' => 200000,
                'supports_streaming' => true,
                'supports_functions' => false,
                'is_active' => true,
            ],
        ];

        foreach ($models as $model) {
            AIModelModel::updateOrCreate(
                ['model_id' => $model['model_id'], 'provider' => $model['provider']],
                $model
            );
        }
    }
}
