<?php

namespace App\Domains\Products\Application\Services;

use App\Domains\Products\Application\DTOs\LandingPageDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LandingPageBuilderService
{
    public function build(LandingPageDTO $dto): array
    {
        $landingPage = [
            'id' => Str::uuid(),
            'product_id' => $dto->product_id,
            'title' => $dto->title,
            'slug' => $dto->slug,
            'content' => json_encode($dto->content),
            'seo' => json_encode($dto->seo),
            'settings' => json_encode($dto->settings),
            'status' => 'draft',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('landing_pages')->insert($landingPage);

        return $landingPage;
    }

    public function optimize($landingPage): bool
    {
        // Implementar otimizações de SEO
        return true;
    }

    public function getPerformanceMetrics($landingPage): array
    {
        return [
            'views' => $landingPage->views ?? 0,
            'conversions' => $landingPage->conversions ?? 0,
            'conversion_rate' => $landingPage->views > 0 
                ? ($landingPage->conversions / $landingPage->views) * 100 
                : 0,
        ];
    }
}
