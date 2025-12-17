<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        $metrics = [
            ['name' => 'Total Revenue', 'key' => 'revenue.total', 'type' => 'currency', 'aggregation' => 'sum'],
            ['name' => 'Total Orders', 'key' => 'orders.total', 'type' => 'number', 'aggregation' => 'count'],
            ['name' => 'Average Order Value', 'key' => 'orders.avg_value', 'type' => 'currency', 'aggregation' => 'avg'],
            ['name' => 'Conversion Rate', 'key' => 'conversion.rate', 'type' => 'percentage', 'aggregation' => 'calculated'],
            ['name' => 'Active Users', 'key' => 'users.active', 'type' => 'number', 'aggregation' => 'count'],
            ['name' => 'New Users', 'key' => 'users.new', 'type' => 'number', 'aggregation' => 'count'],
            ['name' => 'Churn Rate', 'key' => 'users.churn', 'type' => 'percentage', 'aggregation' => 'calculated'],
            ['name' => 'Page Views', 'key' => 'traffic.pageviews', 'type' => 'number', 'aggregation' => 'sum'],
            ['name' => 'Bounce Rate', 'key' => 'traffic.bounce_rate', 'type' => 'percentage', 'aggregation' => 'avg'],
            ['name' => 'Session Duration', 'key' => 'traffic.session_duration', 'type' => 'duration', 'aggregation' => 'avg'],
            ['name' => 'Cart Abandonment', 'key' => 'cart.abandonment', 'type' => 'percentage', 'aggregation' => 'calculated'],
            ['name' => 'Customer Lifetime Value', 'key' => 'customer.ltv', 'type' => 'currency', 'aggregation' => 'avg'],
            ['name' => 'Product Views', 'key' => 'products.views', 'type' => 'number', 'aggregation' => 'sum'],
            ['name' => 'Email Open Rate', 'key' => 'email.open_rate', 'type' => 'percentage', 'aggregation' => 'avg'],
            ['name' => 'Email Click Rate', 'key' => 'email.click_rate', 'type' => 'percentage', 'aggregation' => 'avg'],
        ];

        foreach ($metrics as $metric) {
            DB::table('analytics_metrics')->insert([
                'id' => Str::uuid(),
                'name' => $metric['name'],
                'key' => $metric['key'],
                'type' => $metric['type'],
                'aggregation' => $metric['aggregation'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $kpis = [
            ['name' => 'Monthly Revenue Target', 'metric_key' => 'revenue.total', 'target' => 100000, 'period' => 'monthly'],
            ['name' => 'Daily Orders Target', 'metric_key' => 'orders.total', 'target' => 50, 'period' => 'daily'],
            ['name' => 'Conversion Rate Goal', 'metric_key' => 'conversion.rate', 'target' => 3.5, 'period' => 'monthly'],
            ['name' => 'User Growth Target', 'metric_key' => 'users.new', 'target' => 1000, 'period' => 'monthly'],
            ['name' => 'Customer Retention', 'metric_key' => 'users.churn', 'target' => 5, 'period' => 'monthly'],
        ];

        foreach ($kpis as $kpi) {
            DB::table('analytics_kpis')->insert([
                'id' => Str::uuid(),
                'name' => $kpi['name'],
                'metric_key' => $kpi['metric_key'],
                'target_value' => $kpi['target'],
                'period' => $kpi['period'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $reports = [
            ['name' => 'Sales Overview', 'type' => 'sales', 'config' => json_encode(['metrics' => ['revenue.total', 'orders.total', 'orders.avg_value']])],
            ['name' => 'User Analytics', 'type' => 'users', 'config' => json_encode(['metrics' => ['users.active', 'users.new', 'users.churn']])],
            ['name' => 'Traffic Report', 'type' => 'traffic', 'config' => json_encode(['metrics' => ['traffic.pageviews', 'traffic.bounce_rate', 'traffic.session_duration']])],
        ];

        foreach ($reports as $report) {
            DB::table('analytics_reports')->insert([
                'id' => Str::uuid(),
                'name' => $report['name'],
                'type' => $report['type'],
                'config' => $report['config'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
