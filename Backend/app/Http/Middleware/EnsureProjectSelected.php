<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureProjectSelected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        // Verificar se há projeto selecionado na sessão
        $selectedProjectId = session('selected_project_id');
        
        if (!$selectedProjectId) {
            // Redirecionar para seleção de projetos
            return redirect()->route('projects.select');
        }

        // Verificar se o projeto ainda existe e pertence ao usuário
        $project = \App\Domains\Projects\Models\Project::where('id', $selectedProjectId)
            ->where('owner_id', $user->id)
            ->first();

        if (!$project) {
            // Projeto não encontrado ou não pertence ao usuário
            session()->forget('selected_project_id');
            return redirect()->route('projects.select');
        }

        // Adicionar projeto atual à request para uso nos controllers
        $request->merge(['current_project' => $project]);

        return $next($request);
    }
}