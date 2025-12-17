<?php

namespace Database\Factories\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkflowModelFactory extends Factory
{
    protected $model = WorkflowModel::class;

    public function definition(): array
    {
        $statuses = [
            'draft',
            'active',
            'paused',
            'archived'
        ];

        $categories = [
            'lead_management',
            'email_automation',
            'task_automation',
            'data_processing',
            'notification',
            'integration',
            'approval',
            'onboarding',
            'follow_up',
            'analytics'
        ];

        $status = $this->faker->randomElement($statuses);
        $category = $this->faker->randomElement($categories);

        return [
            'id' => $this->faker->uuid(),
            'name' => $this->generateWorkflowName($category),
            'description' => $this->generateWorkflowDescription($category),
            'status' => $status,
            'definition' => $this->generateWorkflowDefinition($category),
            'user_id' => $this->faker->uuid(),
            'project_id' => $this->faker->uuid(),
            'settings' => $this->generateWorkflowSettings($category),
            'variables' => $this->generateWorkflowVariables($category),
            'last_executed_at' => $status === 'active' ? $this->faker->dateTimeBetween('-7 days', 'now') : null,
            'execution_count' => $this->faker->numberBetween(0, 1000),
            'is_template' => $this->faker->boolean(20),
            'category' => $category,
            'tags' => $this->generateWorkflowTags($category),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'last_executed_at' => null,
            'execution_count' => 0,
            'is_template' => false,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'last_executed_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'execution_count' => $this->faker->numberBetween(1, 100),
            'is_template' => false,
        ]);
    }

    public function paused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paused',
            'last_executed_at' => $this->faker->dateTimeBetween('-30 days', '-7 days'),
            'execution_count' => $this->faker->numberBetween(1, 50),
            'is_template' => false,
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
            'last_executed_at' => $this->faker->dateTimeBetween('-90 days', '-30 days'),
            'execution_count' => $this->faker->numberBetween(1, 100),
            'is_template' => false,
        ]);
    }



    public function template(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_template' => true,
            'status' => 'draft',
            'execution_count' => 0,
            'last_executed_at' => null,
        ]);
    }

    public function leadManagement(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'lead_management',
        ]);
    }

    public function emailAutomation(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'email_automation',
        ]);
    }

    public function taskAutomation(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'task_automation',
        ]);
    }

    public function dataProcessing(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'data_processing',
        ]);
    }

    public function notification(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'notification',
        ]);
    }

    public function integration(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'integration',
        ]);
    }

    public function approval(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'approval',
        ]);
    }

    public function onboarding(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'onboarding',
        ]);
    }

    public function followUp(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'follow_up',
        ]);
    }

    public function analytics(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'analytics',
        ]);
    }

    public function withHighExecutionCount(): static
    {
        return $this->state(fn (array $attributes) => [
            'execution_count' => $this->faker->numberBetween(500, 1000),
        ]);
    }

    public function withLowExecutionCount(): static
    {
        return $this->state(fn (array $attributes) => [
            'execution_count' => $this->faker->numberBetween(0, 10),
        ]);
    }

    public function withCustomSettings(array $settings): static
    {
        return $this->state(fn (array $attributes) => [
            'settings' => $settings,
        ]);
    }

    public function withCustomVariables(array $variables): static
    {
        return $this->state(fn (array $attributes) => [
            'variables' => $variables,
        ]);
    }

    public function withCustomTags(array $tags): static
    {
        return $this->state(fn (array $attributes) => [
            'tags' => $tags,
        ]);
    }

    private function generateWorkflowName(string $category): string
    {
        $templates = [
            '{category} Workflow',
            '{category} Automation',
            '{category} Process',
            '{category} Pipeline',
            '{category} Sequence',
            '{category} Flow',
            '{category} System',
            '{category} Engine'
        ];

        $template = $this->faker->randomElement($templates);
        
        $categoryNames = [
            'lead_management' => 'Lead Management',
            'email_automation' => 'Email Automation',
            'task_automation' => 'Task Automation',
            'data_processing' => 'Data Processing',
            'notification' => 'Notification',
            'integration' => 'Integration',
            'approval' => 'Approval',
            'onboarding' => 'Onboarding',
            'follow_up' => 'Follow Up',
            'analytics' => 'Analytics'
        ];

        return str_replace('{category}', $categoryNames[$category], $template);
    }

    private function generateWorkflowDescription(string $category): string
    {
        $descriptions = [
            'lead_management' => [
                'Automated lead qualification and routing system that processes incoming leads and assigns them to the appropriate sales representatives based on predefined criteria.',
                'Streamlined lead management workflow that captures, scores, and distributes leads to optimize conversion rates and sales efficiency.',
                'Intelligent lead processing system that automatically categorizes and prioritizes leads for maximum sales team productivity.'
            ],
            'email_automation' => [
                'Automated email marketing workflow that sends personalized messages to subscribers based on their behavior and preferences.',
                'Email sequence automation that nurtures leads through the sales funnel with targeted content and timing.',
                'Automated email campaign system that delivers relevant content to different audience segments.'
            ],
            'task_automation' => [
                'Automated task management system that creates, assigns, and tracks tasks based on project milestones and deadlines.',
                'Workflow automation that streamlines repetitive tasks and improves team productivity.',
                'Intelligent task assignment system that distributes work based on team member availability and expertise.'
            ],
            'data_processing' => [
                'Automated data processing workflow that cleans, validates, and transforms data for analysis and reporting.',
                'Data pipeline automation that processes large volumes of information efficiently and accurately.',
                'Automated data quality assurance system that ensures data integrity and consistency.'
            ],
            'notification' => [
                'Automated notification system that sends alerts and updates to relevant stakeholders based on specific triggers.',
                'Multi-channel notification workflow that ensures important information reaches the right people at the right time.',
                'Intelligent notification system that reduces noise while ensuring critical updates are never missed.'
            ],
            'integration' => [
                'System integration workflow that synchronizes data between different platforms and applications.',
                'Automated integration pipeline that connects various tools and services for seamless data flow.',
                'API integration workflow that enables real-time data exchange between systems.'
            ],
            'approval' => [
                'Automated approval workflow that routes requests through the appropriate approval hierarchy.',
                'Document approval system that ensures proper review and authorization before finalization.',
                'Multi-level approval workflow that maintains compliance and governance standards.'
            ],
            'onboarding' => [
                'Automated onboarding workflow that guides new users through the setup and training process.',
                'New user onboarding system that provides personalized guidance and resources.',
                'Automated onboarding pipeline that ensures consistent and comprehensive user experience.'
            ],
            'follow_up' => [
                'Automated follow-up workflow that ensures timely communication with customers and prospects.',
                'Customer follow-up system that maintains engagement and satisfaction.',
                'Automated follow-up sequence that nurtures relationships and drives retention.'
            ],
            'analytics' => [
                'Automated analytics workflow that processes data and generates insights for decision making.',
                'Data analytics pipeline that transforms raw data into actionable business intelligence.',
                'Automated reporting workflow that delivers key metrics and performance indicators.'
            ]
        ];

        return $this->faker->randomElement($descriptions[$category]);
    }

    private function generateWorkflowDefinition(string $category): array
    {
        $baseDefinition = [
            'version' => '1.0',
            'name' => $this->generateWorkflowName($category),
            'description' => $this->generateWorkflowDescription($category),
            'trigger' => [
                'type' => $this->faker->randomElement(['webhook', 'schedule', 'manual', 'event']),
                'config' => [
                    'url' => $this->faker->url(),
                    'method' => $this->faker->randomElement(['GET', 'POST', 'PUT', 'DELETE']),
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer ' . $this->faker->sha256()
                    ]
                ]
            ],
            'nodes' => $this->generateWorkflowNodes($category),
            'connections' => $this->generateWorkflowConnections(),
            'variables' => $this->generateWorkflowVariables($category),
            'settings' => [
                'timeout' => $this->faker->numberBetween(300, 3600),
                'retry_count' => $this->faker->numberBetween(0, 3),
                'parallel_execution' => $this->faker->boolean(),
                'error_handling' => $this->faker->randomElement(['stop', 'continue', 'retry'])
            ]
        ];

        return $baseDefinition;
    }

    private function generateWorkflowNodes(string $category): array
    {
        $nodeTypes = [
            'lead_management' => ['start', 'lead_capture', 'qualification', 'assignment', 'follow_up', 'end'],
            'email_automation' => ['start', 'email_trigger', 'content_generation', 'email_send', 'tracking', 'end'],
            'task_automation' => ['start', 'task_creation', 'assignment', 'notification', 'completion', 'end'],
            'data_processing' => ['start', 'data_input', 'validation', 'transformation', 'output', 'end'],
            'notification' => ['start', 'event_trigger', 'message_generation', 'delivery', 'confirmation', 'end'],
            'integration' => ['start', 'data_sync', 'transformation', 'api_call', 'response_handling', 'end'],
            'approval' => ['start', 'request_submission', 'review', 'approval', 'notification', 'end'],
            'onboarding' => ['start', 'welcome', 'setup', 'training', 'completion', 'end'],
            'follow_up' => ['start', 'trigger_event', 'message_preparation', 'delivery', 'tracking', 'end'],
            'analytics' => ['start', 'data_collection', 'processing', 'analysis', 'reporting', 'end']
        ];

        $nodeTypesForCategory = $nodeTypes[$category] ?? ['start', 'process', 'end'];
        $nodes = [];

        foreach ($nodeTypesForCategory as $index => $nodeType) {
            $nodes[] = [
                'id' => $this->faker->uuid(),
                'type' => $nodeType,
                'name' => ucfirst(str_replace('_', ' ', $nodeType)),
                'position' => [
                    'x' => $index * 200,
                    'y' => 100
                ],
                'config' => [
                    'timeout' => $this->faker->numberBetween(30, 300),
                    'retry_count' => $this->faker->numberBetween(0, 2),
                    'enabled' => true
                ],
                'inputs' => $index > 0 ? [$this->faker->uuid()] : [],
                'outputs' => $index < count($nodeTypesForCategory) - 1 ? [$this->faker->uuid()] : []
            ];
        }

        return $nodes;
    }

    private function generateWorkflowConnections(): array
    {
        $connections = [];
        $numConnections = $this->faker->numberBetween(2, 5);

        for ($i = 0; $i < $numConnections; $i++) {
            $connections[] = [
                'id' => $this->faker->uuid(),
                'source' => $this->faker->uuid(),
                'target' => $this->faker->uuid(),
                'condition' => $this->faker->randomElement(['always', 'success', 'error', 'custom']),
                'config' => [
                    'delay' => $this->faker->numberBetween(0, 60),
                    'enabled' => true
                ]
            ];
        }

        return $connections;
    }

    private function generateWorkflowSettings(string $category): array
    {
        $baseSettings = [
            'enabled' => true,
            'timeout' => $this->faker->numberBetween(300, 3600),
            'retry_count' => $this->faker->numberBetween(0, 3),
            'parallel_execution' => $this->faker->boolean(),
            'error_handling' => $this->faker->randomElement(['stop', 'continue', 'retry']),
            'logging' => [
                'enabled' => true,
                'level' => $this->faker->randomElement(['debug', 'info', 'warning', 'error']),
                'retention_days' => $this->faker->numberBetween(30, 365)
            ],
            'notifications' => [
                'on_success' => $this->faker->boolean(),
                'on_error' => true,
                'on_timeout' => $this->faker->boolean(),
                'channels' => $this->faker->randomElements(['email', 'slack', 'webhook'], 2)
            ]
        ];

        // Add category-specific settings
        switch ($category) {
            case 'lead_management':
                $baseSettings['lead_management'] = [
                    'auto_assign' => $this->faker->boolean(),
                    'scoring_enabled' => true,
                    'follow_up_delay' => $this->faker->numberBetween(1, 7),
                    'max_leads_per_user' => $this->faker->numberBetween(10, 100)
                ];
                break;
            case 'email_automation':
                $baseSettings['email_automation'] = [
                    'personalization' => true,
                    'a_b_testing' => $this->faker->boolean(),
                    'send_time_optimization' => $this->faker->boolean(),
                    'unsubscribe_handling' => true
                ];
                break;
            case 'task_automation':
                $baseSettings['task_automation'] = [
                    'auto_assign' => $this->faker->boolean(),
                    'priority_calculation' => true,
                    'deadline_reminders' => true,
                    'escalation_rules' => $this->faker->boolean()
                ];
                break;
        }

        return $baseSettings;
    }

    private function generateWorkflowVariables(string $category): array
    {
        $baseVariables = [
            'environment' => $this->faker->randomElement(['development', 'staging', 'production']),
            'version' => $this->faker->randomElement(['1.0', '1.1', '2.0']),
            'created_by' => $this->faker->name(),
            'last_modified' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d H:i:s')
        ];

        // Add category-specific variables
        switch ($category) {
            case 'lead_management':
                $baseVariables['lead_management'] = [
                    'min_score' => $this->faker->numberBetween(0, 50),
                    'max_daily_leads' => $this->faker->numberBetween(10, 100),
                    'assignment_rules' => $this->faker->randomElement(['round_robin', 'load_balanced', 'skill_based']),
                    'follow_up_delay_hours' => $this->faker->numberBetween(1, 48)
                ];
                break;
            case 'email_automation':
                $baseVariables['email_automation'] = [
                    'max_emails_per_day' => $this->faker->numberBetween(100, 10000),
                    'bounce_threshold' => $this->faker->numberBetween(5, 20),
                    'unsubscribe_rate_limit' => $this->faker->numberBetween(1, 5),
                    'personalization_level' => $this->faker->randomElement(['basic', 'advanced', 'ai_powered'])
                ];
                break;
            case 'task_automation':
                $baseVariables['task_automation'] = [
                    'default_priority' => $this->faker->randomElement(['low', 'medium', 'high']),
                    'auto_complete' => $this->faker->boolean(),
                    'reminder_frequency' => $this->faker->numberBetween(1, 7),
                    'escalation_threshold' => $this->faker->numberBetween(24, 168)
                ];
                break;
        }

        return $baseVariables;
    }

    private function generateWorkflowTags(string $category): array
    {
        $allTags = [
            'automation',
            'productivity',
            'efficiency',
            'scalable',
            'reliable',
            'monitored',
            'documented',
            'tested',
            'optimized',
            'secure',
            'compliant',
            'integrated',
            'customizable',
            'maintainable',
            'performance',
            'user_friendly',
            'robust',
            'flexible',
            'intelligent',
            'advanced'
        ];

        $categoryTags = [
            'lead_management' => ['lead_processing', 'sales_automation', 'crm_integration'],
            'email_automation' => ['email_marketing', 'campaign_automation', 'personalization'],
            'task_automation' => ['task_management', 'workflow_automation', 'productivity'],
            'data_processing' => ['data_analytics', 'etl', 'data_quality'],
            'notification' => ['alerts', 'communication', 'real_time'],
            'integration' => ['api_integration', 'data_sync', 'system_connectivity'],
            'approval' => ['governance', 'compliance', 'workflow_approval'],
            'onboarding' => ['user_experience', 'training', 'setup_automation'],
            'follow_up' => ['customer_engagement', 'retention', 'communication'],
            'analytics' => ['reporting', 'insights', 'data_visualization']
        ];

        $specificTags = $categoryTags[$category] ?? [];
        $numTags = $this->faker->numberBetween(2, 6);
        
        $selectedTags = array_merge(
            $specificTags,
            $this->faker->randomElements($allTags, max(0, $numTags - count($specificTags)))
        );

        return array_unique($selectedTags);
    }
}