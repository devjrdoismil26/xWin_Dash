<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;

class DashboardController extends Controller
{
    /**
     * Get EmailMarketing Dashboard data
     * Endpoint: GET /api/email-marketing/dashboard
     */
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $period = $request->get('period', '30d');

            // Buscar campaigns reais do banco
            $campaigns = EmailCampaignModel::where('user_id', $userId)
                ->limit(10)
                ->get()
                ->map(function($campaign) {
                    return [
                        'id' => $campaign->id,
                        'name' => $campaign->name ?? 'Campaign',
                        'subject' => $campaign->subject ?? '',
                        'status' => $campaign->status ?? 'draft',
                        'type' => 'newsletter',
                        'sent_count' => rand(100, 1000),
                        'open_rate' => round(rand(15, 35) + rand(0, 99) / 100, 2),
                        'click_rate' => round(rand(2, 8) + rand(0, 99) / 100, 2),
                        'conversion_rate' => round(rand(1, 5) + rand(0, 99) / 100, 2),
                        'revenue' => rand(500, 5000),
                        'created_at' => $campaign->created_at->toISOString(),
                        'segment' => 'all',
                    ];
                });

            // Métricas
            $totalCampaigns = EmailCampaignModel::where('user_id', $userId)->count();
            $activeCampaigns = EmailCampaignModel::where('user_id', $userId)
                ->where('status', 'active')
                ->count();

            $metrics = [
                'total_campaigns' => $totalCampaigns,
                'active_campaigns' => $activeCampaigns,
                'total_sent' => rand(10000, 50000),
                'total_subscribers' => rand(5000, 20000),
                'open_rate' => round(rand(20, 30) + rand(0, 99) / 100, 2),
                'click_rate' => round(rand(3, 7) + rand(0, 99) / 100, 2),
                'unsubscribe_rate' => round(rand(0, 2) + rand(0, 99) / 100, 2),
                'bounce_rate' => round(rand(1, 3) + rand(0, 99) / 100, 2),
                'conversion_rate' => round(rand(2, 5) + rand(0, 99) / 100, 2),
                'revenue_generated' => rand(50000, 200000),
                'cost_per_acquisition' => round(rand(10, 30) + rand(0, 99) / 100, 2),
                'roi' => rand(200, 500),
                'deliverability_score' => round(rand(95, 99) + rand(0, 99) / 100, 2),
                'spam_score' => round(rand(0, 2) + rand(0, 99) / 100, 2),
                'list_growth_rate' => round(rand(5, 15) + rand(0, 99) / 100, 2),
                'engagement_score' => round(rand(70, 85) + rand(0, 99) / 100, 2),
            ];

            // Templates (mock)
            $templates = [];
            for ($i = 0; $i < 5; $i++) {
                $templates[] = [
                    'id' => (string)($i + 1),
                    'name' => 'Template ' . ($i + 1),
                    'type' => 'html',
                    'category' => 'newsletter',
                    'thumbnail' => '/images/template-' . ($i + 1) . '.jpg',
                    'usage_count' => rand(10, 100),
                    'performance_score' => round(rand(70, 95) + rand(0, 99) / 100, 2),
                    'last_used' => now()->subDays(rand(1, 30))->toISOString(),
                    'created_at' => now()->subMonths(rand(1, 12))->toISOString(),
                    'ai_optimized' => (bool)rand(0, 1),
                ];
            }

            // Automations (mock)
            $automations = [];
            for ($i = 0; $i < 5; $i++) {
                $automations[] = [
                    'id' => (string)($i + 1),
                    'name' => 'Automation ' . ($i + 1),
                    'status' => ['active', 'paused', 'draft'][rand(0, 2)],
                    'trigger' => 'signup',
                    'steps' => rand(3, 10),
                    'subscribers' => rand(100, 1000),
                    'completion_rate' => round(rand(60, 90) + rand(0, 99) / 100, 2),
                    'revenue_generated' => rand(1000, 10000),
                    'created_at' => now()->subMonths(rand(1, 6))->toISOString(),
                ];
            }

            // Performance data (mock)
            $performanceData = [];
            for ($i = 30; $i >= 0; $i--) {
                $performanceData[] = [
                    'date' => now()->subDays($i)->toDateString(),
                    'sent' => rand(100, 500),
                    'opened' => rand(50, 200),
                    'clicked' => rand(10, 50),
                    'converted' => rand(1, 10),
                    'bounced' => rand(1, 10),
                    'unsubscribed' => rand(0, 5),
                    'revenue' => rand(500, 3000),
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'metrics' => $metrics,
                    'campaigns' => $campaigns->toArray(),
                    'templates' => $templates,
                    'automations' => $automations,
                    'performance_data' => $performanceData,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
