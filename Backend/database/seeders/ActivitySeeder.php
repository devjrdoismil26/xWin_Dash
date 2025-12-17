<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activityTypes = [
            ['type' => 'user.created', 'category' => 'users', 'description' => 'User account created'],
            ['type' => 'user.updated', 'category' => 'users', 'description' => 'User profile updated'],
            ['type' => 'user.deleted', 'category' => 'users', 'description' => 'User account deleted'],
            ['type' => 'user.login', 'category' => 'auth', 'description' => 'User logged in'],
            ['type' => 'user.logout', 'category' => 'auth', 'description' => 'User logged out'],
            ['type' => 'product.created', 'category' => 'products', 'description' => 'Product created'],
            ['type' => 'product.updated', 'category' => 'products', 'description' => 'Product updated'],
            ['type' => 'product.deleted', 'category' => 'products', 'description' => 'Product deleted'],
            ['type' => 'order.created', 'category' => 'orders', 'description' => 'Order placed'],
            ['type' => 'order.completed', 'category' => 'orders', 'description' => 'Order completed'],
            ['type' => 'order.cancelled', 'category' => 'orders', 'description' => 'Order cancelled'],
            ['type' => 'payment.received', 'category' => 'payments', 'description' => 'Payment received'],
            ['type' => 'payment.failed', 'category' => 'payments', 'description' => 'Payment failed'],
            ['type' => 'media.uploaded', 'category' => 'media', 'description' => 'Media file uploaded'],
            ['type' => 'media.deleted', 'category' => 'media', 'description' => 'Media file deleted'],
            ['type' => 'project.created', 'category' => 'projects', 'description' => 'Project created'],
            ['type' => 'project.updated', 'category' => 'projects', 'description' => 'Project updated'],
            ['type' => 'settings.updated', 'category' => 'system', 'description' => 'System settings updated'],
            ['type' => 'integration.configured', 'category' => 'system', 'description' => 'Integration configured'],
            ['type' => 'export.generated', 'category' => 'system', 'description' => 'Data export generated'],
        ];

        foreach ($activityTypes as $type) {
            DB::table('activity_types')->insert([
                'type' => $type['type'],
                'category' => $type['category'],
                'description' => $type['description'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $categories = [
            ['name' => 'Users', 'slug' => 'users', 'color' => '#3B82F6'],
            ['name' => 'Authentication', 'slug' => 'auth', 'color' => '#10B981'],
            ['name' => 'Products', 'slug' => 'products', 'color' => '#F59E0B'],
            ['name' => 'Orders', 'slug' => 'orders', 'color' => '#8B5CF6'],
            ['name' => 'Payments', 'slug' => 'payments', 'color' => '#EF4444'],
            ['name' => 'Media', 'slug' => 'media', 'color' => '#EC4899'],
            ['name' => 'Projects', 'slug' => 'projects', 'color' => '#06B6D4'],
            ['name' => 'System', 'slug' => 'system', 'color' => '#6B7280'],
        ];

        foreach ($categories as $category) {
            DB::table('activity_categories')->insert([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'color' => $category['color'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
