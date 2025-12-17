<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\SocialBuffer\Services\LinkShortenerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LinkShortenerController extends Controller
{
    public function __construct(private LinkShortenerService $linkShortenerService)
    {
    }

    /**
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function shorten(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização (usar SocialAccount como base)
        $this->authorize('viewAny', \App\Domains\SocialBuffer\Models\SocialAccount::class);
        
        $request->validate([
            'long_url' => 'required|url',
        ]);

        $shortenedLink = $this->linkShortenerService->shortenUrl($request->input('long_url'));

        return response()->json([
            'message' => 'URL encurtada com sucesso.',
            'short_url' => $shortenedLink->short_url,
        ]);
    }

    /**
     * Redirect - Público (não precisa autorização)
     */
    public function redirect(string $shortCode)
    {
        $longUrl = $this->linkShortenerService->getLongUrl($shortCode);

        if ($longUrl) {
            $this->linkShortenerService->incrementClicks($shortCode);
            return redirect()->away($longUrl);
        }

        abort(404);
    }

    /**
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function renderSocialLinkShortenerPage(): \Inertia\Response
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', \App\Domains\SocialBuffer\Models\SocialAccount::class);
        
        return Inertia::render('SocialBuffer/LinkShortener/Index');
    }
}
