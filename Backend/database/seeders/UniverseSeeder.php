<?php

namespace Database\Seeders;

use App\Domains\Universe\Models\UniverseAgent;
use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Models\UniverseTemplate;
use App\Domains\Universe\Models\UniverseTemplateRating;
use App\Domains\Universe\Models\UniverseTemplateAnalytics;
use App\Domains\Universe\Models\UniverseSnapshot;
use App\Domains\Universe\Models\UniverseAnalytics;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniverseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding Universe data...');

        // Create System Templates first
        $this->createSystemTemplates();
        
        // Create User Templates
        $this->createUserTemplates();
        
        // Create Agents
        $this->createAgents();
        
        // Create Instances
        $this->createInstances();
        
        // Create Snapshots
        $this->createSnapshots();
        
        // Create Analytics
        $this->createAnalytics();
        
        // Create Template Ratings and Analytics
        $this->createTemplateEngagement();

        $this->command->info('Universe seeding completed!');
    }

    /**
     * Create system templates.
     */
    private function createSystemTemplates(): void
    {
        $systemTemplates = [
            [
                'name' => 'AI Chat Assistant',
                'description' => 'Template básico para criar assistentes de chat com IA.',
                'category' => 'ai',
                'difficulty' => 'easy',
                'author' => 'System',
                'is_public' => true,
                'is_system' => true,
                'tags' => ['ai', 'chat', 'assistant'],
            ],
            [
                'name' => 'Data Analytics Dashboard',
                'description' => 'Template para criar dashboards de análise de dados.',
                'category' => 'analytics',
                'difficulty' => 'medium',
                'author' => 'System',
                'is_public' => true,
                'is_system' => true,
                'tags' => ['analytics', 'dashboard', 'data'],
            ],
            [
                'name' => 'Marketing Automation',
                'description' => 'Template para automação de campanhas de marketing.',
                'category' => 'marketing',
                'difficulty' => 'hard',
                'author' => 'System',
                'is_public' => true,
                'is_system' => true,
                'tags' => ['marketing', 'automation', 'campaigns'],
            ],
            [
                'name' => 'Business Intelligence',
                'description' => 'Template para análise de inteligência de negócios.',
                'category' => 'business',
                'difficulty' => 'hard',
                'author' => 'System',
                'is_public' => true,
                'is_system' => true,
                'tags' => ['business', 'intelligence', 'analytics'],
            ],
        ];

        foreach ($systemTemplates as $template) {
            UniverseTemplate::factory()->system()->create($template);
        }

        $this->command->info('Created ' . count($systemTemplates) . ' system templates');
    }

    /**
     * Create user templates.
     */
    private function createUserTemplates(): void
    {
        // Assume we have users with IDs 1-10
        for ($userId = 1; $userId <= 5; $userId++) {
            // Create 2-5 templates per user
            $templateCount = rand(2, 5);
            UniverseTemplate::factory($templateCount)->create([
                'user_id' => $userId,
                'is_public' => rand(0, 1) ? true : false,
            ]);
        }

        $this->command->info('Created user templates');
    }

    /**
     * Create agents.
     */
    private function createAgents(): void
    {
        // Create different types of agents
        $agentTypes = ['chatbot', 'assistant', 'analyzer', 'generator'];
        
        foreach ($agentTypes as $type) {
            for ($userId = 1; $userId <= 3; $userId++) {
                UniverseAgent::factory()->create([
                    'user_id' => $userId,
                    'type' => $type,
                    'status' => 'active'
                ]);
            }
        }

        // Create some training agents
        UniverseAgent::factory(5)->training()->create(['user_id' => 1]);

        $this->command->info('Created agents');
    }

    /**
     * Create instances.
     */
    private function createInstances(): void
    {
        $templates = UniverseTemplate::all();
        
        for ($userId = 1; $userId <= 5; $userId++) {
            // Create 3-7 instances per user
            $instanceCount = rand(3, 7);
            
            for ($i = 0; $i < $instanceCount; $i++) {
                $template = $templates->random();
                
                UniverseInstance::factory()->create([
                    'user_id' => $userId,
                    'template_id' => rand(0, 1) ? $template->id : null,
                    'project_id' => rand(0, 1) ? rand(1, 5) : null,
                ]);
            }
        }

        $this->command->info('Created instances');
    }

    /**
     * Create snapshots.
     */
    private function createSnapshots(): void
    {
        $instances = UniverseInstance::all();
        
        foreach ($instances as $instance) {
            // Create 0-3 snapshots per instance
            $snapshotCount = rand(0, 3);
            
            for ($i = 0; $i < $snapshotCount; $i++) {
                UniverseSnapshot::create([
                    'name' => 'Snapshot ' . ($i + 1) . ' - ' . $instance->name,
                    'description' => 'Snapshot created on ' . now()->subDays(rand(1, 30))->format('Y-m-d'),
                    'data' => [
                        'instance_config' => $instance->configuration,
                        'snapshot_date' => now()->subDays(rand(1, 30))->toISOString(),
                        'metrics' => [
                            'cpu_usage' => rand(10, 90),
                            'memory_usage' => rand(20, 80),
                            'active_sessions' => rand(0, 100)
                        ]
                    ],
                    'user_id' => $instance->user_id,
                    'instance_id' => $instance->id,
                ]);
            }
        }

        $this->command->info('Created snapshots');
    }

    /**
     * Create analytics data.
     */
    private function createAnalytics(): void
    {
        $instances = UniverseInstance::all();
        $metrics = [
            'cpu_usage', 'memory_usage', 'active_sessions', 'api_calls', 
            'response_time', 'error_rate', 'user_interactions'
        ];

        foreach ($instances as $instance) {
            // Create analytics for the last 30 days
            for ($day = 30; $day >= 0; $day--) {
                foreach ($metrics as $metric) {
                    UniverseAnalytics::create([
                        'metric_name' => $metric,
                        'value' => $this->generateMetricValue($metric),
                        'timestamp' => now()->subDays($day)->addHours(rand(0, 23)),
                        'instance_id' => $instance->id,
                        'user_id' => $instance->user_id,
                    ]);
                }
            }
        }

        $this->command->info('Created analytics data');
    }

    /**
     * Create template engagement data.
     */
    private function createTemplateEngagement(): void
    {
        $templates = UniverseTemplate::where('is_public', true)->get();
        
        foreach ($templates as $template) {
            // Create ratings from different users
            for ($userId = 1; $userId <= rand(1, 5); $userId++) {
                if (rand(0, 1)) { // 50% chance to rate
                    UniverseTemplateRating::create([
                        'template_id' => $template->id,
                        'user_id' => $userId,
                        'rating' => rand(3, 5), // Generally positive ratings
                        'comment' => rand(0, 1) ? 'Great template, very useful!' : null,
                    ]);
                }
            }

            // Create analytics events
            $actions = ['view', 'download', 'clone', 'rate', 'share'];
            for ($i = 0; $i < rand(10, 50); $i++) {
                UniverseTemplateAnalytics::create([
                    'template_id' => $template->id,
                    'user_id' => rand(1, 5),
                    'action' => $actions[array_rand($actions)],
                    'metadata' => [
                        'timestamp' => now()->subDays(rand(0, 30))->toISOString(),
                        'user_agent' => 'Mozilla/5.0 (compatible; xWin-Dash)',
                        'ip_address' => '127.0.0.1'
                    ]
                ]);
            }
        }

        // Update template ratings and usage counts
        foreach ($templates as $template) {
            $avgRating = $template->ratings()->avg('rating') ?: 0;
            $usageCount = $template->analytics()->count();
            
            $template->update([
                'rating' => round($avgRating, 2),
                'usage_count' => $usageCount
            ]);
        }

        $this->command->info('Created template engagement data');
    }

    /**
     * Generate realistic metric values.
     */
    private function generateMetricValue(string $metric): string
    {
        return match($metric) {
            'cpu_usage' => (string) rand(10, 90),
            'memory_usage' => (string) rand(200, 8000), // MB
            'active_sessions' => (string) rand(0, 100),
            'api_calls' => (string) rand(0, 1000),
            'response_time' => (string) rand(50, 2000), // ms
            'error_rate' => (string) (rand(0, 10) / 100), // percentage
            'user_interactions' => (string) rand(0, 500),
            default => (string) rand(0, 100)
        };
    }
}