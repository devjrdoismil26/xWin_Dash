<?php

namespace App\Domains\Products\Application\Actions;

use App\Domains\Products\Application\Services\LandingPageBuilderService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PublishLandingPageAction
{
    public function __construct(
        private LandingPageBuilderService $builderService
    ) {}

    public function execute(string $landingPageId): bool
    {
        $landingPage = DB::table('landing_pages')->find($landingPageId);

        if (!$landingPage) {
            return false;
        }

        // Otimizar antes de publicar
        $this->builderService->optimize($landingPage);

        // Publicar
        $result = DB::table('landing_pages')
            ->where('id', $landingPageId)
            ->update(['status' => 'published', 'published_at' => now()]);

        // Limpar cache
        Cache::forget("landing_page_{$landingPage->slug}");

        return $result > 0;
    }
}
