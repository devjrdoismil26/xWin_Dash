<?php

namespace App\Domains\SocialBuffer\Http\Controllers\Api;

use App\Domains\SocialBuffer\Services\LinkShortenerService;
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LinkShortenerController extends Controller
{
    protected LinkShortenerService $linkShortenerService;

    public function __construct(LinkShortenerService $linkShortenerService)
    {
        $this->linkShortenerService = $linkShortenerService;
    }

    /**
     * Shorten a given URL.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function shorten(Request $request): JsonResponse
    {
        $request->validate([
            'long_url' => 'required|url',
        ]);

        try {
            $shortenedLink = $this->linkShortenerService->shortenUrl($request->input('long_url'));
            return response()->json(['short_url' => $shortenedLink->shortUrl], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to shorten URL.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Redirect to the original URL from a shortened URL.
     *
     * @param string $code o código do link encurtado
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirect(string $code): \Illuminate\Http\RedirectResponse
    {
        $longUrl = $this->linkShortenerService->retrieveLongUrl($code);

        if (!$longUrl) {
            abort(404);
        }

        return redirect($longUrl);
    }
}
