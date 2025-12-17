<?php

namespace Database\Seeders;

use App\Domains\Universe\Models\AISuperAgent;
use Illuminate\Database\Seeder;

class AISuperAgentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agents = [
            [
                'name' => 'Marketing AI Agent',
                'type' => 'marketing',
                'description' => 'Agente IA especializado em marketing automatizado, campanhas e otimização de conversão',
                'status' => 'active',
                'performance' => [
                    'accuracy' => 94.5,
                    'speed' => 87.2,
                    'efficiency' => 91.8,
                    'uptime' => 99.2
                ],
                'metrics' => [
                    'tasks_completed' => 1247,
                    'success_rate' => 94.5,
                    'avg_response_time' => 1.2,
                    'data_transferred' => 2.4
                ],
                'capabilities' => [
                    'Campaign Automation',
                    'Content Generation',
                    'A/B Testing',
                    'ROI Optimization',
                    'Audience Targeting',
                    'Performance Analytics'
                ],
                'is_premium' => true,
                'is_active' => true,
                'configuration' => [
                    'autoOptimize' => true,
                    'maxBudget' => 10000,
                    'targetAudience' => 'B2B',
                    'channels' => ['email', 'social', 'ads']
                ],
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'last_activity' => now()
            ],
            [
                'name' => 'Sales AI Agent',
                'type' => 'sales',
                'description' => 'Agente IA para automação de vendas, lead scoring e nurturing',
                'status' => 'active',
                'performance' => [
                    'accuracy' => 89.3,
                    'speed' => 92.1,
                    'efficiency' => 88.7,
                    'uptime' => 98.8
                ],
                'metrics' => [
                    'tasks_completed' => 892,
                    'success_rate' => 89.3,
                    'avg_response_time' => 0.8,
                    'data_transferred' => 1.8
                ],
                'capabilities' => [
                    'Lead Scoring',
                    'Sales Forecasting',
                    'Pipeline Management',
                    'Follow-up Automation',
                    'Deal Analysis',
                    'Customer Insights'
                ],
                'is_premium' => true,
                'is_active' => true,
                'configuration' => [
                    'leadScoreThreshold' => 75,
                    'followUpDelay' => 24,
                    'maxDeals' => 50,
                    'priorityLevel' => 'high'
                ],
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'last_activity' => now()
            ],
            [
                'name' => 'Analytics AI Agent',
                'type' => 'analytics',
                'description' => 'Agente IA para análise de dados, insights e relatórios automatizados',
                'status' => 'training',
                'performance' => [
                    'accuracy' => 96.8,
                    'speed' => 78.5,
                    'efficiency' => 93.2,
                    'uptime' => 99.5
                ],
                'metrics' => [
                    'tasks_completed' => 2156,
                    'success_rate' => 96.8,
                    'avg_response_time' => 2.1,
                    'data_transferred' => 5.2
                ],
                'capabilities' => [
                    'Data Analysis',
                    'Predictive Modeling',
                    'Trend Detection',
                    'Report Generation',
                    'Anomaly Detection',
                    'Performance Insights'
                ],
                'is_premium' => false,
                'is_active' => true,
                'configuration' => [
                    'analysisDepth' => 'deep',
                    'reportFrequency' => 'daily',
                    'alertThreshold' => 0.1,
                    'dataSources' => ['all']
                ],
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'last_activity' => now()
            ],
            [
                'name' => 'Security AI Agent',
                'type' => 'security',
                'description' => 'Agente IA para monitoramento de segurança e detecção de ameaças',
                'status' => 'active',
                'performance' => [
                    'accuracy' => 98.2,
                    'speed' => 95.7,
                    'efficiency' => 97.1,
                    'uptime' => 99.9
                ],
                'metrics' => [
                    'tasks_completed' => 3456,
                    'success_rate' => 98.2,
                    'avg_response_time' => 0.3,
                    'data_transferred' => 0.8
                ],
                'capabilities' => [
                    'Threat Detection',
                    'Vulnerability Scanning',
                    'Access Control',
                    'Audit Logging',
                    'Incident Response',
                    'Compliance Monitoring'
                ],
                'is_premium' => true,
                'is_active' => true,
                'configuration' => [
                    'threatLevel' => 'high',
                    'scanFrequency' => 'continuous',
                    'autoResponse' => true,
                    'notificationLevel' => 'critical'
                ],
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'last_activity' => now()
            ],
            [
                'name' => 'Support AI Agent',
                'type' => 'support',
                'description' => 'Agente IA para atendimento ao cliente e suporte automatizado',
                'status' => 'active',
                'performance' => [
                    'accuracy' => 91.7,
                    'speed' => 89.4,
                    'efficiency' => 90.3,
                    'uptime' => 98.5
                ],
                'metrics' => [
                    'tasks_completed' => 1876,
                    'success_rate' => 91.7,
                    'avg_response_time' => 1.5,
                    'data_transferred' => 1.2
                ],
                'capabilities' => [
                    'Ticket Resolution',
                    'FAQ Automation',
                    'Sentiment Analysis',
                    'Escalation Management',
                    'Knowledge Base',
                    'Customer Satisfaction'
                ],
                'is_premium' => false,
                'is_active' => true,
                'configuration' => [
                    'responseTime' => 'fast',
                    'escalationThreshold' => 3,
                    'languageSupport' => ['pt', 'en', 'es'],
                    'satisfactionTarget' => 90
                ],
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'last_activity' => now()
            ],
            [
                'name' => 'Content AI Agent',
                'type' => 'content',
                'description' => 'Agente IA para criação e otimização de conteúdo',
                'status' => 'inactive',
                'performance' => [
                    'accuracy' => 87.9,
                    'speed' => 85.6,
                    'efficiency' => 86.8,
                    'uptime' => 97.2
                ],
                'metrics' => [
                    'tasks_completed' => 654,
                    'success_rate' => 87.9,
                    'avg_response_time' => 3.2,
                    'data_transferred' => 0.6
                ],
                'capabilities' => [
                    'Content Generation',
                    'SEO Optimization',
                    'Plagiarism Check',
                    'Tone Analysis',
                    'Multilingual Support',
                    'Content Strategy'
                ],
                'is_premium' => true,
                'is_active' => false,
                'configuration' => [
                    'contentType' => 'blog',
                    'seoOptimization' => true,
                    'plagiarismCheck' => true,
                    'tone' => 'professional'
                ],
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'last_activity' => now()->subDays(1)
            ]
        ];

        foreach ($agents as $agent) {
            AISuperAgent::create($agent);
        }
    }
}