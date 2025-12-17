<?php

namespace Tests\Feature\AI;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;
use Mockery;

class AIControllerTest extends TestCase
{
    use RefreshDatabase;

    protected UserModel $user;
    protected ProjectModel $project;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = UserModel::factory()->create();
        $this->project = ProjectModel::factory()->create(['user_id' => $this->user->id]);
        
        Queue::fake();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_requires_authentication_for_all_routes()
    {
        $routes = [
            'POST' => '/api/ai/generate',
            'GET' => '/api/ai/providers',
            'POST' => '/api/ai/generate-text',
            'POST' => '/api/ai/generate-image',
            'POST' => '/api/ai/generate-video',
            'POST' => '/api/ai/chat',
            'POST' => '/api/ai/generate-multimodal',
            'POST' => '/api/ai/analyze-text',
            'POST' => '/api/ai/generate-social-content',
            'POST' => '/api/ai/analyze-sentiment',
            'POST' => '/api/ai/translate-text',
            'POST' => '/api/ai/summarize-text',
            'GET' => '/api/ai/services-status',
            'GET' => '/api/ai/models',
            'GET' => '/api/ai/test-connections',
            'GET' => '/api/ai/stats'
        ];

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function it_can_generate_content_with_valid_data()
    {
        $this->actingAs($this->user);

        $generateData = [
            'type' => 'text',
            'provider' => 'openai',
            'model' => 'gpt-3.5-turbo',
            'prompt' => 'Write a short story about a robot',
            'parameters' => [
                'max_tokens' => 100,
                'temperature' => 0.7
            ]
        ];

        $response = $this->postJson('/api/ai/generate', $generateData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'generation_id'
                    ]
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_generation()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/generate', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['type', 'provider', 'model', 'prompt']);
    }

    /** @test */
    public function it_can_generate_text_with_gemini()
    {
        $this->actingAs($this->user);

        $textData = [
            'prompt' => 'Write a creative story about space exploration',
            'model' => 'gemini-1.5-pro'
        ];

        $response = $this->postJson('/api/ai/generate-text', $textData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'text',
                        'model',
                        'timestamp'
                    ]
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_text_generation()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/generate-text', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['prompt']);
    }

    /** @test */
    public function it_can_generate_image_with_gemini()
    {
        $this->actingAs($this->user);

        $imageData = [
            'prompt' => 'A beautiful sunset over mountains',
            'width' => 1024,
            'height' => 1024,
            'style' => 'photographic',
            'quality' => 'high'
        ];

        $response = $this->postJson('/api/ai/generate-image', $imageData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_image_generation()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/generate-image', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['prompt']);
    }

    /** @test */
    public function it_can_generate_video_with_veo2()
    {
        $this->actingAs($this->user);

        $videoData = [
            'prompt' => 'A cat playing with a ball of yarn',
            'duration' => 5,
            'quality' => 'high',
            'style' => 'realistic',
            'aspect_ratio' => '16:9'
        ];

        $response = $this->postJson('/api/ai/generate-video', $videoData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_can_chat_intelligently()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'What is the weather like today?',
            'context' => [
                'previous_messages' => [],
                'user_preferences' => []
            ]
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_chat()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/chat', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['message']);
    }

    /** @test */
    public function it_can_generate_multimodal_content()
    {
        $this->actingAs($this->user);

        $multimodalData = [
            'type' => 'multimodal',
            'prompt' => 'Create a presentation about AI',
            'include_text' => true,
            'include_images' => true,
            'include_video' => false
        ];

        $response = $this->postJson('/api/ai/generate-multimodal', $multimodalData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_can_analyze_text_advanced()
    {
        $this->actingAs($this->user);

        $analysisData = [
            'text' => 'This is a sample text for analysis. It contains multiple sentences and should be analyzed for sentiment, summary, and other features.',
            'sentiment' => true,
            'summary' => true,
            'translate_to' => 'pt',
            'translate_from' => 'en',
            'pylab_analysis' => true
        ];

        $response = $this->postJson('/api/ai/analyze-text', $analysisData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_text_analysis()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/analyze-text', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['text']);
    }

    /** @test */
    public function it_can_generate_social_media_content()
    {
        $this->actingAs($this->user);

        $socialData = [
            'platform' => 'instagram',
            'content_type' => 'post',
            'topic' => 'AI and technology',
            'tone' => 'professional',
            'target_audience' => 'tech enthusiasts',
            'hashtags' => ['#AI', '#Technology', '#Innovation']
        ];

        $response = $this->postJson('/api/ai/generate-social-content', $socialData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_can_analyze_sentiment()
    {
        $this->actingAs($this->user);

        $sentimentData = [
            'text' => 'I love this new AI feature! It works perfectly and makes my life so much easier.'
        ];

        $response = $this->postJson('/api/ai/analyze-sentiment', $sentimentData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_sentiment_analysis()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/analyze-sentiment', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['text']);
    }

    /** @test */
    public function it_can_translate_text()
    {
        $this->actingAs($this->user);

        $translateData = [
            'text' => 'Hello, how are you today?',
            'target_language' => 'pt',
            'source_language' => 'en'
        ];

        $response = $this->postJson('/api/ai/translate-text', $translateData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'translated_text',
                        'source_language',
                        'target_language'
                    ]
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_translation()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/translate-text', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['text']);
    }

    /** @test */
    public function it_can_summarize_text()
    {
        $this->actingAs($this->user);

        $summarizeData = [
            'text' => 'This is a very long text that needs to be summarized. It contains multiple paragraphs and sentences that should be condensed into a shorter version while maintaining the key information and main points.',
            'max_length' => 100
        ];

        $response = $this->postJson('/api/ai/summarize-text', $summarizeData);

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'summary',
                        'max_length'
                    ]
                ]);
    }

    /** @test */
    public function it_validates_required_fields_for_summarization()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/summarize-text', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['text']);
    }

    /** @test */
    public function it_can_get_providers()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/providers');

        $response->assertOk()
                ->assertJsonStructure([
                    'providers'
                ]);
    }

    /** @test */
    public function it_can_get_services_status()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/services-status');

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_can_get_models()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/models');

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_can_test_connections()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/test-connections');

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function it_can_get_stats()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/stats');

        $response->assertOk()
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'total_generations',
                        'total_tokens',
                        'total_cost',
                        'favorite_provider',
                        'this_month',
                        'by_provider'
                    ]
                ]);
    }

    /** @test */
    public function it_handles_generation_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\AIService::class, function ($mock) {
            $mock->shouldReceive('generate')
                 ->andThrow(new \Exception('AI service unavailable'));
        });

        $generateData = [
            'type' => 'text',
            'provider' => 'openai',
            'model' => 'gpt-3.5-turbo',
            'prompt' => 'Test prompt'
        ];

        $response = $this->postJson('/api/ai/generate', $generateData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_text_generation_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('generateText')
                 ->andThrow(new \Exception('Gemini service unavailable'));
        });

        $textData = [
            'prompt' => 'Test prompt'
        ];

        $response = $this->postJson('/api/ai/generate-text', $textData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_image_generation_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('generateImage')
                 ->andThrow(new \Exception('Image generation service unavailable'));
        });

        $imageData = [
            'prompt' => 'Test image prompt'
        ];

        $response = $this->postJson('/api/ai/generate-image', $imageData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_chat_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\AIIntegrationService::class, function ($mock) {
            $mock->shouldReceive('intelligentChat')
                 ->andThrow(new \Exception('Chat service unavailable'));
        });

        $chatData = [
            'message' => 'Test message'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_analysis_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\AIIntegrationService::class, function ($mock) {
            $mock->shouldReceive('advancedTextAnalysis')
                 ->andThrow(new \Exception('Analysis service unavailable'));
        });

        $analysisData = [
            'text' => 'Test text for analysis'
        ];

        $response = $this->postJson('/api/ai/analyze-text', $analysisData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_sentiment_analysis_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('analyzeSentiment')
                 ->andThrow(new \Exception('Sentiment analysis service unavailable'));
        });

        $sentimentData = [
            'text' => 'Test text for sentiment analysis'
        ];

        $response = $this->postJson('/api/ai/analyze-sentiment', $sentimentData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_translation_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('translateText')
                 ->andThrow(new \Exception('Translation service unavailable'));
        });

        $translateData = [
            'text' => 'Test text for translation'
        ];

        $response = $this->postJson('/api/ai/translate-text', $translateData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_summarization_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('summarizeText')
                 ->andThrow(new \Exception('Summarization service unavailable'));
        });

        $summarizeData = [
            'text' => 'Test text for summarization'
        ];

        $response = $this->postJson('/api/ai/summarize-text', $summarizeData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_services_status_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\AIIntegrationService::class, function ($mock) {
            $mock->shouldReceive('getServicesStatus')
                 ->andThrow(new \Exception('Status service unavailable'));
        });

        $response = $this->getJson('/api/ai/services-status');

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_models_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('listModels')
                 ->andThrow(new \Exception('Models service unavailable'));
        });

        $response = $this->getJson('/api/ai/models');

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_test_connections_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\AIService::class, function ($mock) {
            $mock->shouldReceive('testConnections')
                 ->andThrow(new \Exception('Connection test service unavailable'));
        });

        $response = $this->getJson('/api/ai/test-connections');

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_handles_stats_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock a service to throw an exception
        $this->mock(\App\Domains\AI\Services\AIService::class, function ($mock) {
            $mock->shouldReceive('getStats')
                 ->andThrow(new \Exception('Stats service unavailable'));
        });

        $response = $this->getJson('/api/ai/stats');

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'error'
                ]);
    }

    /** @test */
    public function it_can_validate_api_key()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/validate-api-key');

        $response->assertOk()
                ->assertJsonStructure([
                    'success'
                ]);
    }

    /** @test */
    public function it_can_get_history()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai/history');

        $response->assertOk()
                ->assertJsonStructure([
                    'data'
                ]);
    }

    /** @test */
    public function it_can_delete_history()
    {
        $this->actingAs($this->user);

        $response = $this->deleteJson('/api/ai/history/test-id');

        $response->assertStatus(204);
    }
}