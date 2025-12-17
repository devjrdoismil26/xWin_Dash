<?php

namespace Database\Seeders;

use App\Domains\Universe\Models\BlockMarketplace;
use Illuminate\Database\Seeder;

class BlockMarketplaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blocks = [
            [
                'name' => 'Advanced Analytics Pro',
                'description' => 'Analytics avançados com IA para insights profundos',
                'category' => 'Analytics',
                'author' => 'xWin Team',
                'version' => '2.1.0',
                'price' => 0,
                'rating' => 4.9,
                'downloads' => 15420,
                'tags' => ['analytics', 'ai', 'insights', 'pro'],
                'preview' => '/previews/advanced-analytics.jpg',
                'features' => ['IA Insights', 'Real-time Analytics', 'Custom Dashboards', 'Export Reports'],
                'compatibility' => ['Dashboard', 'CRM', 'E-commerce'],
                'is_premium' => false,
                'is_featured' => true,
                'is_new' => false,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'AI Marketing Agent',
                'description' => 'Agente IA especializado em marketing automatizado',
                'category' => 'AI',
                'author' => 'AI Solutions',
                'version' => '1.5.2',
                'price' => 99,
                'rating' => 4.8,
                'downloads' => 8930,
                'tags' => ['ai', 'marketing', 'automation', 'agent'],
                'preview' => '/previews/ai-marketing.jpg',
                'features' => ['Campaign Automation', 'Content Generation', 'A/B Testing', 'ROI Optimization'],
                'compatibility' => ['Email Marketing', 'Social Buffer', 'Analytics'],
                'is_premium' => true,
                'is_featured' => true,
                'is_new' => true,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'Enterprise Security Suite',
                'description' => 'Suite completa de segurança empresarial',
                'category' => 'Security',
                'author' => 'Security Pro',
                'version' => '3.0.1',
                'price' => 299,
                'rating' => 4.9,
                'downloads' => 5670,
                'tags' => ['security', 'enterprise', 'compliance', 'audit'],
                'preview' => '/previews/enterprise-security.jpg',
                'features' => ['2FA/MFA', 'Audit Logs', 'Compliance Reports', 'Threat Detection'],
                'compatibility' => ['All Modules'],
                'is_premium' => true,
                'is_featured' => false,
                'is_new' => false,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'Universal Connector',
                'description' => 'Conector universal para integrações externas',
                'category' => 'Integration',
                'author' => 'Integration Hub',
                'version' => '1.2.0',
                'price' => 0,
                'rating' => 4.7,
                'downloads' => 12300,
                'tags' => ['integration', 'api', 'connector', 'universal'],
                'preview' => '/previews/universal-connector.jpg',
                'features' => ['50+ Integrations', 'Custom APIs', 'Real-time Sync', 'Error Handling'],
                'compatibility' => ['All Modules'],
                'is_premium' => false,
                'is_featured' => true,
                'is_new' => false,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'AR/VR Interface',
                'description' => 'Interface imersiva para realidade aumentada e virtual',
                'category' => 'Innovation',
                'author' => 'Future Tech',
                'version' => '0.9.0',
                'price' => 199,
                'rating' => 4.6,
                'downloads' => 2340,
                'tags' => ['ar', 'vr', 'immersive', 'innovation'],
                'preview' => '/previews/ar-vr-interface.jpg',
                'features' => ['AR Visualization', 'VR Workspace', 'Hand Tracking', 'Spatial Audio'],
                'compatibility' => ['Dashboard', 'Canvas', '3D View'],
                'is_premium' => true,
                'is_featured' => false,
                'is_new' => true,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'Smart CRM Block',
                'description' => 'CRM inteligente com automação de vendas',
                'category' => 'CRM',
                'author' => 'CRM Experts',
                'version' => '2.0.0',
                'price' => 149,
                'rating' => 4.8,
                'downloads' => 7890,
                'tags' => ['crm', 'sales', 'automation', 'smart'],
                'preview' => '/previews/smart-crm.jpg',
                'features' => ['Lead Scoring', 'Pipeline Management', 'Email Automation', 'Analytics'],
                'compatibility' => ['CRM', 'Sales', 'Analytics'],
                'is_premium' => true,
                'is_featured' => true,
                'is_new' => false,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'E-commerce Analytics',
                'description' => 'Analytics especializado para e-commerce',
                'category' => 'Analytics',
                'author' => 'E-commerce Pro',
                'version' => '1.8.0',
                'price' => 79,
                'rating' => 4.7,
                'downloads' => 4560,
                'tags' => ['ecommerce', 'analytics', 'sales', 'tracking'],
                'preview' => '/previews/ecommerce-analytics.jpg',
                'features' => ['Sales Tracking', 'Customer Analytics', 'Product Performance', 'Revenue Reports'],
                'compatibility' => ['E-commerce', 'Analytics', 'Sales'],
                'is_premium' => true,
                'is_featured' => false,
                'is_new' => false,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ],
            [
                'name' => 'Social Media Manager',
                'description' => 'Gerenciador completo de redes sociais',
                'category' => 'Marketing',
                'author' => 'Social Media Pro',
                'version' => '1.5.0',
                'price' => 0,
                'rating' => 4.5,
                'downloads' => 11200,
                'tags' => ['social', 'media', 'marketing', 'automation'],
                'preview' => '/previews/social-media-manager.jpg',
                'features' => ['Multi-platform', 'Scheduling', 'Analytics', 'Engagement'],
                'compatibility' => ['Social Buffer', 'Marketing', 'Analytics'],
                'is_premium' => false,
                'is_featured' => true,
                'is_new' => false,
                'is_active' => true,
                'author_id' => '9fc52e83-0207-4644-a003-039b4b6567e3'
            ]
        ];

        foreach ($blocks as $block) {
            BlockMarketplace::create($block);
        }
    }
}