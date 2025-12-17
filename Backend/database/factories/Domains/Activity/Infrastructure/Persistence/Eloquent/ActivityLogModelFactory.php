<?php

namespace Database\Factories\Domains\Activity\Infrastructure\Persistence\Eloquent;

use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel>
 */
class ActivityLogModelFactory extends Factory
{
    protected $model = ActivityLogModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'log_name' => $this->faker->randomElement([
                'user_created',
                'user_updated',
                'user_deleted',
                'login',
                'logout',
                'password_changed',
                'profile_updated',
                'project_created',
                'project_updated',
                'project_deleted',
                'file_uploaded',
                'file_downloaded',
                'email_sent',
                'notification_sent',
                'system_backup',
                'system_restore',
                'settings_updated',
                'permission_granted',
                'permission_revoked',
                'api_call',
                'error_occurred',
                'maintenance_mode',
                'cache_cleared',
                'database_migrated',
                'queue_processed'
            ]),
            'description' => $this->faker->sentence(),
            'subject_type' => $this->faker->randomElement([
                'App\\Models\\User',
                'App\\Models\\Project',
                'App\\Models\\File',
                'App\\Models\\Email',
                'App\\Models\\Notification',
                'App\\Models\\Setting',
                'App\\Models\\Permission',
                null
            ]),
            'subject_id' => $this->faker->optional(0.7)->uuid(),
            'causer_type' => $this->faker->randomElement([
                'App\\Models\\User',
                'App\\Models\\System',
                'App\\Models\\Admin',
                null
            ]),
            'causer_id' => $this->faker->optional(0.8)->uuid(),
            'properties' => $this->faker->optional(0.6)->randomElements([
                'ip_address' => $this->faker->ipv4(),
                'user_agent' => $this->faker->userAgent(),
                'browser' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                'os' => $this->faker->randomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
                'device' => $this->faker->randomElement(['desktop', 'mobile', 'tablet']),
                'location' => [
                    'country' => $this->faker->country(),
                    'city' => $this->faker->city(),
                    'timezone' => $this->faker->timezone()
                ],
                'session_id' => $this->faker->uuid(),
                'request_id' => $this->faker->uuid(),
                'duration' => $this->faker->numberBetween(100, 5000),
                'memory_usage' => $this->faker->numberBetween(1024, 1048576),
                'cpu_usage' => $this->faker->randomFloat(2, 0, 100),
                'disk_usage' => $this->faker->numberBetween(1024, 1073741824),
                'network_latency' => $this->faker->numberBetween(10, 1000),
                'error_code' => $this->faker->optional(0.1)->randomElement(['E001', 'E002', 'E003', 'E004']),
                'error_message' => $this->faker->optional(0.1)->sentence(),
                'stack_trace' => $this->faker->optional(0.05)->paragraphs(3, true),
                'changes' => [
                    'old' => $this->faker->optional(0.3)->randomElements([
                        'status' => $this->faker->randomElement(['active', 'inactive', 'pending']),
                        'role' => $this->faker->randomElement(['user', 'admin', 'moderator']),
                        'permissions' => $this->faker->randomElements(['read', 'write', 'delete', 'admin'])
                    ]),
                    'new' => $this->faker->optional(0.3)->randomElements([
                        'status' => $this->faker->randomElement(['active', 'inactive', 'pending']),
                        'role' => $this->faker->randomElement(['user', 'admin', 'moderator']),
                        'permissions' => $this->faker->randomElements(['read', 'write', 'delete', 'admin'])
                    ])
                ],
                'metadata' => [
                    'version' => $this->faker->semver(),
                    'environment' => $this->faker->randomElement(['local', 'staging', 'production']),
                    'feature_flags' => $this->faker->randomElements(['feature_a', 'feature_b', 'feature_c']),
                    'tags' => $this->faker->words(3),
                    'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'critical']),
                    'category' => $this->faker->randomElement(['authentication', 'authorization', 'data', 'system', 'user'])
                ]
            ], $this->faker->numberBetween(1, 5))
        ];
    }

    /**
     * Indicate that the activity log is for a user action.
     */
    public function userAction(): static
    {
        return $this->state(fn (array $attributes) => [
            'log_name' => $this->faker->randomElement(['login', 'logout', 'profile_updated', 'password_changed']),
            'causer_type' => 'App\\Models\\User',
            'causer_id' => User::factory(),
        ]);
    }

    /**
     * Indicate that the activity log is for a system action.
     */
    public function systemAction(): static
    {
        return $this->state(fn (array $attributes) => [
            'log_name' => $this->faker->randomElement(['system_backup', 'system_restore', 'maintenance_mode', 'cache_cleared']),
            'causer_type' => 'App\\Models\\System',
            'causer_id' => null,
        ]);
    }

    /**
     * Indicate that the activity log has an error.
     */
    public function withError(): static
    {
        return $this->state(fn (array $attributes) => [
            'log_name' => 'error_occurred',
            'properties' => array_merge($attributes['properties'] ?? [], [
                'error_code' => $this->faker->randomElement(['E001', 'E002', 'E003', 'E004']),
                'error_message' => $this->faker->sentence(),
                'stack_trace' => $this->faker->paragraphs(3, true)
            ])
        ]);
    }

    /**
     * Indicate that the activity log has performance data.
     */
    public function withPerformanceData(): static
    {
        return $this->state(fn (array $attributes) => [
            'properties' => array_merge($attributes['properties'] ?? [], [
                'duration' => $this->faker->numberBetween(100, 5000),
                'memory_usage' => $this->faker->numberBetween(1024, 1048576),
                'cpu_usage' => $this->faker->randomFloat(2, 0, 100),
                'network_latency' => $this->faker->numberBetween(10, 1000)
            ])
        ]);
    }

    /**
     * Indicate that the activity log has minimal data.
     */
    public function minimal(): static
    {
        return $this->state(fn (array $attributes) => [
            'subject_type' => null,
            'subject_id' => null,
            'causer_type' => null,
            'causer_id' => null,
            'properties' => null,
        ]);
    }
}