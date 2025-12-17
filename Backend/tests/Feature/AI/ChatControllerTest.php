<?php

namespace Tests\Feature\AI;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Mockery;

class ChatControllerTest extends TestCase
{
    use RefreshDatabase;

    protected UserModel $user;
    protected ProjectModel $project;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = UserModel::factory()->create();
        $this->project = ProjectModel::factory()->create(['user_id' => $this->user->id]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->postJson('/api/ai/chat', [
            'message' => 'Hello, how are you?'
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function it_can_send_chat_message()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Hello, how are you?',
            'history' => [],
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_validates_required_message_field()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai/chat', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['message']);
    }

    /** @test */
    public function it_can_send_chat_message_with_history()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'What is the weather like?',
            'history' => [
                [
                    'role' => 'user',
                    'content' => 'Hello'
                ],
                [
                    'role' => 'assistant',
                    'content' => 'Hi! How can I help you today?'
                ]
            ],
            'provider' => 'gemini'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_different_providers()
    {
        $this->actingAs($this->user);

        $providers = ['default', 'gemini', 'openai', 'anthropic'];

        foreach ($providers as $provider) {
            $chatData = [
                'message' => 'Test message with ' . $provider,
                'provider' => $provider
            ];

            $response = $this->postJson('/api/ai/chat', $chatData);

            $response->assertOk()
                    ->assertJsonStructure([
                        'data' => [
                            'message',
                            'timestamp',
                            'provider'
                        ]
                    ]);
        }
    }

    /** @test */
    public function it_handles_chat_service_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock the ChatService to throw an exception
        $this->mock(\App\Domains\AI\Services\ChatService::class, function ($mock) {
            $mock->shouldReceive('sendMessage')
                 ->andThrow(new \Exception('Chat service unavailable'));
        });

        $chatData = [
            'message' => 'Test message'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'error'
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_context()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Can you help me with my project?',
            'history' => [],
            'provider' => 'default',
            'context' => [
                'project_id' => $this->project->id,
                'user_preferences' => [
                    'language' => 'en',
                    'tone' => 'professional'
                ]
            ]
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_long_history()
    {
        $this->actingAs($this->user);

        $history = [];
        for ($i = 0; $i < 10; $i++) {
            $history[] = [
                'role' => 'user',
                'content' => "User message {$i}"
            ];
            $history[] = [
                'role' => 'assistant',
                'content' => "Assistant response {$i}"
            ];
        }

        $chatData = [
            'message' => 'This is a new message',
            'history' => $history,
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_special_characters()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Hello! How are you? I\'m doing great. "This is a test" with special chars: @#$%^&*()',
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_unicode_characters()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Hello! 你好! Hola! مرحبا! Привет!',
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_empty_history()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'This is my first message',
            'history' => [],
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_without_provider()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Test message without provider'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_long_message()
    {
        $this->actingAs($this->user);

        $longMessage = str_repeat('This is a very long message. ', 100);

        $chatData = [
            'message' => $longMessage,
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_complex_history()
    {
        $this->actingAs($this->user);

        $complexHistory = [
            [
                'role' => 'user',
                'content' => 'I need help with coding'
            ],
            [
                'role' => 'assistant',
                'content' => 'I\'d be happy to help! What programming language are you working with?'
            ],
            [
                'role' => 'user',
                'content' => 'I\'m working with PHP and Laravel'
            ],
            [
                'role' => 'assistant',
                'content' => 'Great! Laravel is an excellent PHP framework. What specific issue are you facing?'
            ],
            [
                'role' => 'user',
                'content' => 'I\'m having trouble with database relationships'
            ]
        ];

        $chatData = [
            'message' => 'Can you explain how to set up a many-to-many relationship?',
            'history' => $complexHistory,
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_malformed_history()
    {
        $this->actingAs($this->user);

        $malformedHistory = [
            [
                'role' => 'user',
                'content' => 'Hello'
            ],
            [
                'role' => 'assistant',
                'content' => 'Hi!'
            ],
            [
                'role' => 'invalid_role',
                'content' => 'This should be handled gracefully'
            ]
        ];

        $chatData = [
            'message' => 'Test message with malformed history',
            'history' => $malformedHistory,
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_empty_message()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => '',
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['message']);
    }

    /** @test */
    public function it_can_send_chat_message_with_whitespace_only_message()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => '   ',
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['message']);
    }

    /** @test */
    public function it_can_send_chat_message_with_newlines()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => "Hello!\n\nHow are you?\n\nI'm doing well, thank you!",
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_tabs()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => "Hello!\tHow are you?\tI'm doing well!",
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_html_tags()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Hello! <b>How are you?</b> <i>I\'m doing well!</i>',
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_json_content()
    {
        $this->actingAs($this->user);

        $jsonContent = json_encode([
            'name' => 'John Doe',
            'age' => 30,
            'city' => 'New York'
        ]);

        $chatData = [
            'message' => "Can you parse this JSON: {$jsonContent}",
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }

    /** @test */
    public function it_can_send_chat_message_with_code_blocks()
    {
        $this->actingAs($this->user);

        $chatData = [
            'message' => 'Can you help me with this code?\n\n```php\n<?php\necho "Hello World";\n?>\n```',
            'provider' => 'default'
        ];

        $response = $this->postJson('/api/ai/chat', $chatData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'message',
                        'timestamp',
                        'provider'
                    ]
                ]);
    }
}