<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class IntegrationsSeeder extends Seeder
{
    /**
     * Seed integrations with default configurations
     */
    public function run(): void
    {
        $integrations = [
            // Social Media
            [
                'id' => Str::uuid(),
                'name' => 'Facebook',
                'slug' => 'facebook',
                'type' => 'social_media',
                'description' => 'Facebook social media integration',
                'icon' => 'facebook',
                'color' => '#1877F2',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'facebook',
                'config' => json_encode([
                    'api_version' => 'v18.0',
                    'scopes' => ['pages_manage_posts', 'pages_read_engagement'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Instagram',
                'slug' => 'instagram',
                'type' => 'social_media',
                'description' => 'Instagram social media integration',
                'icon' => 'instagram',
                'color' => '#E4405F',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'instagram',
                'config' => json_encode([
                    'api_version' => 'v18.0',
                    'scopes' => ['instagram_basic', 'instagram_content_publish'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Twitter/X',
                'slug' => 'twitter',
                'type' => 'social_media',
                'description' => 'Twitter (X) social media integration',
                'icon' => 'twitter',
                'color' => '#000000',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'twitter',
                'config' => json_encode([
                    'api_version' => 'v2',
                    'scopes' => ['tweet.read', 'tweet.write', 'users.read'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'LinkedIn',
                'slug' => 'linkedin',
                'type' => 'social_media',
                'description' => 'LinkedIn professional network integration',
                'icon' => 'linkedin',
                'color' => '#0A66C2',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'linkedin',
                'config' => json_encode([
                    'api_version' => 'v2',
                    'scopes' => ['w_member_social', 'r_liteprofile'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Messaging
            [
                'id' => Str::uuid(),
                'name' => 'WhatsApp Business',
                'slug' => 'whatsapp',
                'type' => 'messaging',
                'description' => 'WhatsApp Business API integration',
                'icon' => 'message-circle',
                'color' => '#25D366',
                'is_active' => true,
                'is_oauth' => false,
                'config' => json_encode([
                    'api_version' => 'v18.0',
                    'webhook_verify_token' => Str::random(32),
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Advertising
            [
                'id' => Str::uuid(),
                'name' => 'Google Ads',
                'slug' => 'google-ads',
                'type' => 'advertising',
                'description' => 'Google Ads advertising platform',
                'icon' => 'trending-up',
                'color' => '#4285F4',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'google',
                'config' => json_encode([
                    'api_version' => 'v15',
                    'scopes' => ['https://www.googleapis.com/auth/adwords'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Facebook Ads',
                'slug' => 'facebook-ads',
                'type' => 'advertising',
                'description' => 'Facebook Ads advertising platform',
                'icon' => 'target',
                'color' => '#1877F2',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'facebook',
                'config' => json_encode([
                    'api_version' => 'v18.0',
                    'scopes' => ['ads_management', 'ads_read'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // AI Services
            [
                'id' => Str::uuid(),
                'name' => 'OpenAI',
                'slug' => 'openai',
                'type' => 'ai',
                'description' => 'OpenAI GPT models integration',
                'icon' => 'cpu',
                'color' => '#10A37F',
                'is_active' => true,
                'is_oauth' => false,
                'config' => json_encode([
                    'models' => ['gpt-4', 'gpt-3.5-turbo', 'dall-e-3'],
                    'default_model' => 'gpt-4',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Google Gemini',
                'slug' => 'gemini',
                'type' => 'ai',
                'description' => 'Google Gemini AI integration',
                'icon' => 'sparkles',
                'color' => '#4285F4',
                'is_active' => true,
                'is_oauth' => false,
                'config' => json_encode([
                    'models' => ['gemini-pro', 'gemini-pro-vision'],
                    'default_model' => 'gemini-pro',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Analytics
            [
                'id' => Str::uuid(),
                'name' => 'Google Analytics',
                'slug' => 'google-analytics',
                'type' => 'analytics',
                'description' => 'Google Analytics tracking',
                'icon' => 'bar-chart',
                'color' => '#F9AB00',
                'is_active' => true,
                'is_oauth' => true,
                'oauth_provider' => 'google',
                'config' => json_encode([
                    'api_version' => 'v4',
                    'scopes' => ['https://www.googleapis.com/auth/analytics.readonly'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Email
            [
                'id' => Str::uuid(),
                'name' => 'SendGrid',
                'slug' => 'sendgrid',
                'type' => 'email',
                'description' => 'SendGrid email service',
                'icon' => 'mail',
                'color' => '#1A82E2',
                'is_active' => true,
                'is_oauth' => false,
                'config' => json_encode([
                    'api_version' => 'v3',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Storage
            [
                'id' => Str::uuid(),
                'name' => 'AWS S3',
                'slug' => 'aws-s3',
                'type' => 'storage',
                'description' => 'Amazon S3 cloud storage',
                'icon' => 'database',
                'color' => '#FF9900',
                'is_active' => true,
                'is_oauth' => false,
                'config' => json_encode([
                    'region' => 'us-east-1',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('integrations')->insert($integrations);

        $this->command->info('✅ Integrations seeded successfully!');
        $this->command->info('   - ' . count($integrations) . ' integrations created');
    }
}
