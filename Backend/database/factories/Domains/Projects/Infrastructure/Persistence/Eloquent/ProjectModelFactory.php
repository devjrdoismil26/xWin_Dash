<?php

namespace Database\Factories\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectModelFactory extends Factory
{
    protected $model = ProjectModel::class;

    public function definition(): array
    {
        $statuses = [
            'draft',
            'planning',
            'active',
            'paused',
            'completed',
            'archived'
        ];

        $types = [
            'manual',
            'universe'
        ];

        $priorities = [
            'low',
            'medium',
            'high',
            'critical'
        ];

        $industries = [
            'Technology',
            'Healthcare',
            'Finance',
            'Education',
            'Retail',
            'Manufacturing',
            'Consulting',
            'Real Estate',
            'Media',
            'Transportation',
            'Energy',
            'Government',
            'Nonprofit',
            'Entertainment',
            'Sports'
        ];

        $currencies = [
            'USD',
            'EUR',
            'GBP',
            'BRL',
            'CAD',
            'AUD',
            'JPY',
            'CHF',
            'CNY',
            'INR'
        ];

        $status = $this->faker->randomElement($statuses);
        $type = $this->faker->randomElement($types);
        $priority = $this->faker->randomElement($priorities);
        $industry = $this->faker->randomElement($industries);
        $currency = $this->faker->randomElement($currencies);

        return [
            'name' => $this->generateProjectName($type, $industry),
            'description' => $this->generateProjectDescription($type, $industry),
            'slug' => $this->faker->slug(),
            'logo' => $this->faker->imageUrl(),
            'website' => $this->faker->url(),
            'industry' => $industry,
            'timezone' => $this->faker->timezone(),
            'currency' => $currency,
            'settings' => $this->generateSettings($type, $industry),
            'modules' => $this->generateModules($type, $industry),
            'is_active' => $this->faker->boolean(80),
            'owner_id' => $this->faker->uuid(),
        ];
    }

    public function planning(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'planning',
            'progress' => $this->faker->numberBetween(0, 20),
            'is_active' => true,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'progress' => $this->faker->numberBetween(20, 80),
            'is_active' => true,
        ]);
    }

    public function paused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paused',
            'progress' => $this->faker->numberBetween(30, 70),
            'is_active' => false,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'progress' => 100,
            'is_active' => false,
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'progress' => $this->faker->numberBetween(0, 20),
            'is_active' => true,
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
            'progress' => 100,
            'is_active' => false,
        ]);
    }

    public function manual(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'manual',
        ]);
    }

    public function universe(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'universe',
        ]);
    }

    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }

    public function critical(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'critical',
        ]);
    }

    public function lowPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'low',
        ]);
    }

    public function withHighProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'progress' => $this->faker->numberBetween(80, 100),
        ]);
    }

    public function withLowProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'progress' => $this->faker->numberBetween(0, 30),
        ]);
    }

    public function withCustomSettings(array $settings): static
    {
        return $this->state(fn (array $attributes) => [
            'settings' => $settings,
        ]);
    }

    public function withModules(array $modules): static
    {
        return $this->state(fn (array $attributes) => [
            'modules' => $modules,
        ]);
    }

    private function generateProjectName(string $type, string $industry): string
    {
        $templates = [
            '{type} Campaign for {industry}',
            '{industry} {type} Initiative',
            '{type} Project - {industry} Focus',
            '{industry} {type} Strategy',
            '{type} Development - {industry}',
            '{industry} {type} Program',
            '{type} Implementation - {industry}',
            '{industry} {type} Solution'
        ];

        $template = $this->faker->randomElement($templates);
        
        return str_replace(
            ['{type}', '{industry}'],
            [ucfirst($type), $industry],
            $template
        );
    }

    private function generateProjectDescription(string $type, string $industry): string
    {
        $descriptions = [
            "A comprehensive {type} project designed to enhance {industry} operations and drive growth through innovative strategies and cutting-edge technology.",
            "This {type} initiative focuses on transforming {industry} processes, improving efficiency, and delivering measurable results for stakeholders.",
            "An ambitious {type} program that leverages advanced methodologies to address key challenges in the {industry} sector.",
            "A strategic {type} project aimed at revolutionizing {industry} practices through data-driven insights and modern solutions.",
            "This {type} endeavor combines industry expertise with innovative approaches to create value in the {industry} market.",
            "A forward-thinking {type} initiative that addresses emerging trends and opportunities in the {industry} landscape."
        ];

        $description = $this->faker->randomElement($descriptions);
        
        return str_replace(
            ['{type}', '{industry}'],
            [$type, $industry],
            $description
        );
    }

    private function generateBlocks(): array
    {
        $blockTypes = [
            'header',
            'content',
            'image',
            'video',
            'form',
            'cta',
            'testimonial',
            'pricing',
            'features',
            'contact'
        ];

        $numBlocks = $this->faker->numberBetween(3, 8);
        $blocks = [];

        for ($i = 0; $i < $numBlocks; $i++) {
            $blocks[] = [
                'id' => $this->faker->uuid(),
                'type' => $this->faker->randomElement($blockTypes),
                'content' => $this->faker->paragraph(),
                'position' => $i,
                'settings' => [
                    'background_color' => $this->faker->hexColor(),
                    'text_color' => $this->faker->hexColor(),
                    'padding' => $this->faker->numberBetween(10, 50),
                ]
            ];
        }

        return $blocks;
    }

    private function generateFlows(): array
    {
        $flowTypes = [
            'lead_capture',
            'email_sequence',
            'onboarding',
            'checkout',
            'support',
            'feedback',
            'survey',
            'approval'
        ];

        $numFlows = $this->faker->numberBetween(2, 5);
        $flows = [];

        for ($i = 0; $i < $numFlows; $i++) {
            $flows[] = [
                'id' => $this->faker->uuid(),
                'name' => $this->faker->words(3, true),
                'type' => $this->faker->randomElement($flowTypes),
                'steps' => $this->faker->numberBetween(3, 10),
                'is_active' => $this->faker->boolean(70),
                'settings' => [
                    'auto_start' => $this->faker->boolean(),
                    'delay_between_steps' => $this->faker->numberBetween(1, 7),
                    'max_retries' => $this->faker->numberBetween(1, 3),
                ]
            ];
        }

        return $flows;
    }

    private function generateConnections(): array
    {
        $connectionTypes = [
            'email',
            'sms',
            'webhook',
            'api',
            'database',
            'crm',
            'analytics',
            'payment'
        ];

        $numConnections = $this->faker->numberBetween(1, 4);
        $connections = [];

        for ($i = 0; $i < $numConnections; $i++) {
            $connections[] = [
                'id' => $this->faker->uuid(),
                'name' => $this->faker->words(2, true),
                'type' => $this->faker->randomElement($connectionTypes),
                'is_connected' => $this->faker->boolean(80),
                'last_sync' => $this->faker->dateTimeBetween('-30 days', 'now'),
                'settings' => [
                    'endpoint' => $this->faker->url(),
                    'api_key' => $this->faker->sha256(),
                    'timeout' => $this->faker->numberBetween(30, 300),
                ]
            ];
        }

        return $connections;
    }

    private function generateUniverseConfig(): array
    {
        return [
            'theme' => $this->faker->randomElement(['light', 'dark', 'auto']),
            'layout' => $this->faker->randomElement(['grid', 'list', 'card']),
            'features' => [
                'ai_assistant' => $this->faker->boolean(70),
                'analytics' => $this->faker->boolean(90),
                'automation' => $this->faker->boolean(60),
                'collaboration' => $this->faker->boolean(80),
                'integrations' => $this->faker->boolean(85),
            ],
            'permissions' => [
                'can_edit' => $this->faker->boolean(90),
                'can_delete' => $this->faker->boolean(50),
                'can_share' => $this->faker->boolean(70),
                'can_export' => $this->faker->boolean(80),
            ]
        ];
    }

    private function generateSettings(string $type, string $industry): array
    {
        $baseSettings = [
            'notifications' => [
                'email' => $this->faker->boolean(80),
                'sms' => $this->faker->boolean(30),
                'push' => $this->faker->boolean(60),
            ],
            'privacy' => [
                'public' => $this->faker->boolean(40),
                'require_auth' => $this->faker->boolean(70),
                'data_retention' => $this->faker->numberBetween(30, 365),
            ],
            'performance' => [
                'cache_enabled' => $this->faker->boolean(90),
                'cdn_enabled' => $this->faker->boolean(60),
                'compression' => $this->faker->boolean(80),
            ]
        ];

        // Add type-specific settings
        switch ($type) {
            case 'marketing':
                $baseSettings['marketing'] = [
                    'tracking_enabled' => $this->faker->boolean(90),
                    'ab_testing' => $this->faker->boolean(50),
                    'personalization' => $this->faker->boolean(70),
                ];
                break;
            case 'sales':
                $baseSettings['sales'] = [
                    'crm_integration' => $this->faker->boolean(80),
                    'lead_scoring' => $this->faker->boolean(60),
                    'pipeline_management' => $this->faker->boolean(90),
                ];
                break;
            case 'product':
                $baseSettings['product'] = [
                    'version_control' => $this->faker->boolean(90),
                    'feature_flags' => $this->faker->boolean(40),
                    'user_feedback' => $this->faker->boolean(70),
                ];
                break;
        }

        return $baseSettings;
    }

    private function generateModules(string $type, string $industry): array
    {
        $modules = [];

        // Common modules
        $modules['budget'] = $this->faker->randomFloat(2, 1000, 100000);
        $modules['timeline'] = $this->faker->numberBetween(30, 365);
        $modules['team_size'] = $this->faker->numberBetween(1, 20);

        // Type-specific modules
        switch ($type) {
            case 'marketing':
                $modules['target_audience'] = $this->faker->randomElement(['B2B', 'B2C', 'Both']);
                $modules['channels'] = $this->faker->randomElements(['email', 'social', 'paid', 'organic'], 2);
                break;
            case 'sales':
                $modules['target_revenue'] = $this->faker->randomFloat(2, 10000, 1000000);
                $modules['sales_cycle'] = $this->faker->numberBetween(30, 180);
                break;
            case 'product':
                $modules['platform'] = $this->faker->randomElement(['web', 'mobile', 'desktop', 'all']);
                $modules['tech_stack'] = $this->faker->randomElements(['react', 'vue', 'angular', 'php', 'python'], 2);
                break;
        }

        // Industry-specific modules
        switch ($industry) {
            case 'Technology':
                $modules['compliance'] = $this->faker->randomElements(['GDPR', 'CCPA', 'SOX', 'HIPAA'], 1);
                break;
            case 'Healthcare':
                $modules['compliance'] = ['HIPAA'];
                $modules['patient_data'] = $this->faker->boolean();
                break;
            case 'Finance':
                $modules['compliance'] = $this->faker->randomElements(['PCI-DSS', 'SOX', 'Basel III'], 1);
                $modules['risk_level'] = $this->faker->randomElement(['low', 'medium', 'high']);
                break;
        }

        return $modules;
    }
}