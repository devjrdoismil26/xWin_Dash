<?php

namespace Database\Seeders;

use App\Domains\Universe\Models\UniversalConnector;
use Illuminate\Database\Seeder;

class UniversalConnectorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $connectors = [
            [
                'name' => 'Slack Integration',
                'description' => 'Connect with Slack workspace for notifications and team collaboration',
                'type' => 'slack',
                'configuration' => [
                    'webhook_url' => 'https://hooks.slack.com/services/example',
                    'channel' => '#general',
                    'bot_token' => 'xoxb-example-token',
                ],
                'status' => 'active',
                'is_connected' => true,
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3', // Using existing user UUID
                'metadata' => [
                    'workspace_id' => 'T1234567890',
                    'team_name' => 'Example Team',
                ],
            ],
            [
                'name' => 'Discord Bot',
                'description' => 'Discord bot for community management and notifications',
                'type' => 'discord',
                'configuration' => [
                    'bot_token' => 'ODc4OTQ5OTQ5OTQ5OTQ5OTQ5.GhJkLm.Example',
                    'guild_id' => '123456789012345678',
                    'channel_id' => '987654321098765432',
                ],
                'status' => 'active',
                'is_connected' => true,
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'guild_name' => 'Example Guild',
                    'member_count' => 150,
                ],
            ],
            [
                'name' => 'WhatsApp Business API',
                'description' => 'WhatsApp Business API for customer communication',
                'type' => 'whatsapp',
                'configuration' => [
                    'phone_number_id' => '123456789012345',
                    'access_token' => 'EAAGExampleToken',
                    'webhook_verify_token' => 'example_verify_token',
                ],
                'status' => 'active',
                'is_connected' => true,
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'business_name' => 'Example Business',
                    'phone_number' => '+1234567890',
                ],
            ],
            [
                'name' => 'Telegram Bot',
                'description' => 'Telegram bot for automated messaging and updates',
                'type' => 'telegram',
                'configuration' => [
                    'bot_token' => '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
                    'chat_id' => '-1001234567890',
                    'parse_mode' => 'HTML',
                ],
                'status' => 'active',
                'is_connected' => true,
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'bot_username' => 'example_bot',
                    'chat_title' => 'Example Channel',
                ],
            ],
            [
                'name' => 'Email SMTP',
                'description' => 'SMTP email connector for sending notifications',
                'type' => 'email',
                'configuration' => [
                    'smtp_host' => 'smtp.gmail.com',
                    'smtp_port' => 587,
                    'smtp_username' => 'example@gmail.com',
                    'smtp_password' => 'app_password',
                    'encryption' => 'tls',
                ],
                'status' => 'active',
                'is_connected' => true,
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'from_name' => 'Example System',
                    'from_email' => 'noreply@example.com',
                ],
            ],
            [
                'name' => 'Database Connector',
                'description' => 'Connect to external database for data synchronization',
                'type' => 'database',
                'configuration' => [
                    'host' => 'localhost',
                    'port' => 3306,
                    'database' => 'external_db',
                    'username' => 'db_user',
                    'password' => 'db_password',
                    'driver' => 'mysql',
                ],
                'status' => 'inactive',
                'is_connected' => false,
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'connection_name' => 'External Database',
                    'last_sync' => null,
                ],
            ],
        ];

        foreach ($connectors as $connectorData) {
            UniversalConnector::create($connectorData);
        }
    }
}