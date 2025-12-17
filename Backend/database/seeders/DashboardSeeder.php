<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DashboardSeeder extends Seeder
{
    public function run(): void
    {
        $widgets = [
            ['name' => 'Total Users', 'type' => 'stat', 'config' => json_encode(['metric' => 'users.total', 'icon' => 'users'])],
            ['name' => 'Revenue', 'type' => 'stat', 'config' => json_encode(['metric' => 'revenue.total', 'icon' => 'dollar'])],
            ['name' => 'Active Projects', 'type' => 'stat', 'config' => json_encode(['metric' => 'projects.active', 'icon' => 'briefcase'])],
            ['name' => 'Conversion Rate', 'type' => 'stat', 'config' => json_encode(['metric' => 'conversion.rate', 'icon' => 'trending-up'])],
            ['name' => 'Sales Chart', 'type' => 'chart', 'config' => json_encode(['chartType' => 'line', 'dataSource' => 'sales'])],
            ['name' => 'Traffic Sources', 'type' => 'chart', 'config' => json_encode(['chartType' => 'pie', 'dataSource' => 'traffic'])],
            ['name' => 'Recent Orders', 'type' => 'table', 'config' => json_encode(['dataSource' => 'orders', 'limit' => 10])],
            ['name' => 'Top Products', 'type' => 'list', 'config' => json_encode(['dataSource' => 'products', 'limit' => 5])],
            ['name' => 'Activity Feed', 'type' => 'feed', 'config' => json_encode(['dataSource' => 'activities', 'limit' => 20])],
            ['name' => 'Quick Actions', 'type' => 'actions', 'config' => json_encode(['actions' => ['create_order', 'add_user', 'new_product']])],
        ];

        foreach ($widgets as $widget) {
            DB::table('widgets')->insert([
                'id' => Str::uuid(),
                'name' => $widget['name'],
                'type' => $widget['type'],
                'config' => $widget['config'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $layouts = [
            ['name' => 'Default', 'config' => json_encode(['grid' => '3x3', 'widgets' => [1,2,3,4,5,6,7,8,9]])],
            ['name' => 'Analytics', 'config' => json_encode(['grid' => '2x4', 'widgets' => [1,2,5,6]])],
            ['name' => 'Executive', 'config' => json_encode(['grid' => '4x2', 'widgets' => [1,2,3,4]])],
        ];

        foreach ($layouts as $layout) {
            DB::table('dashboard_layouts')->insert([
                'id' => Str::uuid(),
                'name' => $layout['name'],
                'config' => $layout['config'],
                'is_default' => $layout['name'] === 'Default',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
