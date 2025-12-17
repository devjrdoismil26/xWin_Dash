<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SettingsSeeder extends Seeder
{
    /**
     * Seed system settings with default values
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'id' => Str::uuid(),
                'key' => 'app.name',
                'value' => 'xWin_Dash',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Application name',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'app.timezone',
                'value' => 'UTC',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Default timezone',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'app.language',
                'value' => 'pt-BR',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Default language',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'app.currency',
                'value' => 'BRL',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Default currency',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Email Settings
            [
                'id' => Str::uuid(),
                'key' => 'email.from_name',
                'value' => 'xWin_Dash',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Default sender name',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'email.from_address',
                'value' => 'noreply@xwin-dash.com',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Default sender email',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'email.daily_limit',
                'value' => '10000',
                'type' => 'integer',
                'group' => 'email',
                'description' => 'Daily email sending limit',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Security Settings
            [
                'id' => Str::uuid(),
                'key' => 'security.password_min_length',
                'value' => '8',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Minimum password length',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'security.session_lifetime',
                'value' => '120',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Session lifetime in minutes',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'security.max_login_attempts',
                'value' => '5',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Maximum login attempts before lockout',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'security.lockout_duration',
                'value' => '15',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Lockout duration in minutes',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Features Settings
            [
                'id' => Str::uuid(),
                'key' => 'features.ai_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'features',
                'description' => 'Enable AI features',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'features.aura_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'features',
                'description' => 'Enable Aura (WhatsApp) features',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'features.analytics_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'features',
                'description' => 'Enable Analytics features',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'features.workflows_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'features',
                'description' => 'Enable Workflows features',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Storage Settings
            [
                'id' => Str::uuid(),
                'key' => 'storage.max_upload_size',
                'value' => '10485760',
                'type' => 'integer',
                'group' => 'storage',
                'description' => 'Maximum upload size in bytes (10MB)',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'storage.allowed_extensions',
                'value' => json_encode(['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx']),
                'type' => 'array',
                'group' => 'storage',
                'description' => 'Allowed file extensions',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // API Settings
            [
                'id' => Str::uuid(),
                'key' => 'api.rate_limit',
                'value' => '60',
                'type' => 'integer',
                'group' => 'api',
                'description' => 'API rate limit per minute',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'api.timeout',
                'value' => '30',
                'type' => 'integer',
                'group' => 'api',
                'description' => 'API timeout in seconds',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Notification Settings
            [
                'id' => Str::uuid(),
                'key' => 'notifications.email_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Enable email notifications',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'notifications.push_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Enable push notifications',
                'is_public' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Maintenance Settings
            [
                'id' => Str::uuid(),
                'key' => 'maintenance.mode',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'maintenance',
                'description' => 'Maintenance mode status',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'maintenance.message',
                'value' => 'System is under maintenance. Please try again later.',
                'type' => 'string',
                'group' => 'maintenance',
                'description' => 'Maintenance mode message',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('settings')->insert($settings);

        $this->command->info('✅ Settings seeded successfully!');
        $this->command->info('   - ' . count($settings) . ' settings created');
    }
}
