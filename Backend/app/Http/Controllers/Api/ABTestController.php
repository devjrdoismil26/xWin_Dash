<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ABTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ABTestController extends Controller
{
    public function index(): JsonResponse
    {
        $tests = ABTest::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tests);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'target' => 'required|string',
            'variants' => 'required|array',
            'metrics' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $test = ABTest::create([
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'target' => $request->target,
            'status' => 'draft',
            'variants' => $request->variants,
            'metrics' => $request->metrics ?? [],
            'user_id' => Auth::id()
        ]);

        return response()->json($test, 201);
    }

    public function show(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json($test);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string',
            'target' => 'sometimes|string',
            'variants' => 'sometimes|array',
            'metrics' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $test->update($request->only(['name', 'description', 'type', 'target', 'variants', 'metrics']));

        return response()->json($test);
    }

    public function destroy(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $test->delete();

        return response()->json(['message' => 'Test deleted successfully']);
    }

    public function duplicate(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $duplicate = $test->replicate();
        $duplicate->name = $test->name . ' (Copy)';
        $duplicate->status = 'draft';
        $duplicate->started_at = null;
        $duplicate->ended_at = null;
        $duplicate->winner_id = null;
        $duplicate->save();

        return response()->json($duplicate, 201);
    }

    public function start(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $test->update([
            'status' => 'running',
            'started_at' => now()
        ]);

        return response()->json($test);
    }

    public function pause(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $test->update(['status' => 'paused']);

        return response()->json($test);
    }

    public function resume(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $test->update(['status' => 'running']);

        return response()->json($test);
    }

    public function stop(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $test->update([
            'status' => 'completed',
            'ended_at' => now()
        ]);

        return response()->json($test);
    }

    public function archive(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $test->update(['status' => 'archived']);

        return response()->json($test);
    }

    public function addVariant(Request $request, string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = $test->variants;
        $variants[] = $request->variant;
        $test->update(['variants' => $variants]);

        return response()->json($test);
    }

    public function updateVariant(Request $request, string $testId, string $variantId): JsonResponse
    {
        $test = ABTest::where('id', $testId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = $test->variants;
        $key = array_search($variantId, array_column($variants, 'id'));
        
        if ($key !== false) {
            $variants[$key] = array_merge($variants[$key], $request->variant);
            $test->update(['variants' => $variants]);
        }

        return response()->json($test);
    }

    public function removeVariant(string $testId, string $variantId): JsonResponse
    {
        $test = ABTest::where('id', $testId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = array_filter($test->variants, fn($v) => $v['id'] !== $variantId);
        $test->update(['variants' => array_values($variants)]);

        return response()->json($test);
    }

    public function reorderVariants(Request $request, string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variantIds = $request->variantIds;
        $variants = $test->variants;
        
        usort($variants, function($a, $b) use ($variantIds) {
            return array_search($a['id'], $variantIds) - array_search($b['id'], $variantIds);
        });

        $test->update(['variants' => $variants]);

        return response()->json($test);
    }

    public function results(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json([
            'test_id' => $test->id,
            'status' => $test->status,
            'variants' => $test->variants,
            'metrics' => $test->metrics,
            'winner_id' => $test->winner_id
        ]);
    }

    public function detailedResults(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = $test->variants;
        $detailedMetrics = [];

        foreach ($variants as $variant) {
            $detailedMetrics[] = [
                'variant_id' => $variant['id'] ?? '',
                'name' => $variant['name'] ?? '',
                'impressions' => $variant['impressions'] ?? 0,
                'clicks' => $variant['clicks'] ?? 0,
                'conversions' => $variant['conversions'] ?? 0,
                'conversion_rate' => $this->calculateConversionRate($variant),
                'click_through_rate' => $this->calculateCTR($variant),
                'confidence_interval' => $this->calculateConfidenceInterval($variant),
                'revenue' => $variant['revenue'] ?? 0,
                'avg_order_value' => $this->calculateAOV($variant)
            ];
        }

        return response()->json([
            'test' => $test,
            'detailed_metrics' => $detailedMetrics,
            'summary' => [
                'total_impressions' => array_sum(array_column($variants, 'impressions')),
                'total_conversions' => array_sum(array_column($variants, 'conversions')),
                'best_performer' => $this->findBestPerformer($detailedMetrics)
            ]
        ]);
    }

    public function conversionData(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = $test->variants;
        $conversionData = [];

        foreach ($variants as $variant) {
            $conversionData[] = [
                'variant_id' => $variant['id'] ?? '',
                'name' => $variant['name'] ?? '',
                'conversions_by_day' => $variant['conversions_by_day'] ?? [],
                'conversion_funnel' => $variant['conversion_funnel'] ?? [],
                'time_to_convert' => $variant['time_to_convert'] ?? []
            ];
        }

        return response()->json(['conversions' => $conversionData]);
    }

    public function statisticalSignificance(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = $test->variants;
        
        if (count($variants) < 2) {
            return response()->json(['significance' => 0]);
        }

        $control = $variants[0];
        $variant = $variants[1];

        $significance = $this->calculateZScore($control, $variant);

        return response()->json(['significance' => $significance]);
    }

    public function winner(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($test->winner_id) {
            return response()->json(['winner' => $test->winner_id]);
        }

        $variants = $test->variants;
        $winner = null;
        $maxConversionRate = 0;

        foreach ($variants as $variant) {
            $rate = $this->calculateConversionRate($variant);
            if ($rate > $maxConversionRate) {
                $maxConversionRate = $rate;
                $winner = $variant['id'] ?? null;
            }
        }

        return response()->json(['winner' => $winner]);
    }

    public function recommendations(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $variants = $test->variants;
        $recommendations = [];

        foreach ($variants as $variant) {
            $conversionRate = $this->calculateConversionRate($variant);
            $sampleSize = $variant['impressions'] ?? 0;

            if ($sampleSize < 100) {
                $recommendations[] = [
                    'type' => 'warning',
                    'variant_id' => $variant['id'] ?? '',
                    'message' => 'Sample size too small. Need at least 100 impressions for reliable results.'
                ];
            }

            if ($conversionRate < 0.01) {
                $recommendations[] = [
                    'type' => 'alert',
                    'variant_id' => $variant['id'] ?? '',
                    'message' => 'Very low conversion rate. Consider revising the variant.'
                ];
            }
        }

        if (empty($recommendations)) {
            $recommendations[] = [
                'type' => 'success',
                'message' => 'Test is performing well. Continue monitoring.'
            ];
        }

        return response()->json(['recommendations' => $recommendations]);
    }

    public function optimizationSuggestions(string $id): JsonResponse
    {
        $test = ABTest::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $suggestions = [
            [
                'category' => 'traffic',
                'suggestion' => 'Increase traffic allocation to better performing variant',
                'priority' => 'high'
            ],
            [
                'category' => 'duration',
                'suggestion' => 'Run test for at least 2 weeks to account for weekly patterns',
                'priority' => 'medium'
            ],
            [
                'category' => 'variants',
                'suggestion' => 'Consider testing more radical changes for bigger impact',
                'priority' => 'low'
            ]
        ];

        return response()->json(['suggestions' => $suggestions]);
    }

    public function nextTestIdeas(Request $request): JsonResponse
    {
        $ideas = [
            [
                'title' => 'Test different headlines',
                'description' => 'Try variations in headline copy to improve engagement',
                'estimated_impact' => 'high'
            ],
            [
                'title' => 'Test CTA button colors',
                'description' => 'Different colors can significantly impact click-through rates',
                'estimated_impact' => 'medium'
            ],
            [
                'title' => 'Test form length',
                'description' => 'Shorter forms often lead to higher completion rates',
                'estimated_impact' => 'high'
            ]
        ];

        return response()->json(['ideas' => $ideas]);
    }

    private function calculateConversionRate(array $variant): float
    {
        $impressions = $variant['impressions'] ?? 0;
        $conversions = $variant['conversions'] ?? 0;
        
        return $impressions > 0 ? round(($conversions / $impressions) * 100, 2) : 0;
    }

    private function calculateCTR(array $variant): float
    {
        $impressions = $variant['impressions'] ?? 0;
        $clicks = $variant['clicks'] ?? 0;
        
        return $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0;
    }

    private function calculateAOV(array $variant): float
    {
        $conversions = $variant['conversions'] ?? 0;
        $revenue = $variant['revenue'] ?? 0;
        
        return $conversions > 0 ? round($revenue / $conversions, 2) : 0;
    }

    private function calculateConfidenceInterval(array $variant): array
    {
        $rate = $this->calculateConversionRate($variant) / 100;
        $n = $variant['impressions'] ?? 0;
        
        if ($n === 0) {
            return ['lower' => 0, 'upper' => 0];
        }

        $z = 1.96; // 95% confidence
        $margin = $z * sqrt(($rate * (1 - $rate)) / $n);
        
        return [
            'lower' => round(max(0, $rate - $margin) * 100, 2),
            'upper' => round(min(1, $rate + $margin) * 100, 2)
        ];
    }

    private function calculateZScore(array $control, array $variant): float
    {
        $p1 = ($control['conversions'] ?? 0) / max(1, $control['impressions'] ?? 1);
        $p2 = ($variant['conversions'] ?? 0) / max(1, $variant['impressions'] ?? 1);
        $n1 = $control['impressions'] ?? 0;
        $n2 = $variant['impressions'] ?? 0;

        if ($n1 === 0 || $n2 === 0) {
            return 0;
        }

        $p = ($p1 * $n1 + $p2 * $n2) / ($n1 + $n2);
        $se = sqrt($p * (1 - $p) * (1/$n1 + 1/$n2));
        
        if ($se === 0) {
            return 0;
        }

        $z = abs($p2 - $p1) / $se;
        
        return round(min(0.99, 1 - (1 / (1 + exp(-0.717 * $z - 0.416 * $z * $z)))), 4);
    }

    private function findBestPerformer(array $metrics): ?string
    {
        $best = null;
        $maxRate = 0;

        foreach ($metrics as $metric) {
            if ($metric['conversion_rate'] > $maxRate) {
                $maxRate = $metric['conversion_rate'];
                $best = $metric['variant_id'];
            }
        }

        return $best;
    }
}
