<?php

namespace App\Domains\Core\Http\Middleware;

use App\Domains\Core\Services\UserPreferenceService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Supondo que este serviço exista

class LoadUserPreferences
{
    protected UserPreferenceService $userPreferenceService;

    public function __construct(UserPreferenceService $userPreferenceService)
    {
        $this->userPreferenceService = $userPreferenceService;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request                                                                          $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     *
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $preferences = $this->userPreferenceService->getUserPreferences(Auth::id());
            // Você pode armazenar as preferências em algum lugar acessível, como a sessão ou um singleton
            // Ex: app()->instance('user.preferences', $preferences);
            // Ou adicioná-las à requisição
            $request->attributes->add(['user_preferences' => $preferences]);
        }

        return $next($request);
    }
}
